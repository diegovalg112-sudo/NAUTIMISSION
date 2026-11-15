import React, { useEffect, useRef, useState } from 'react';

export type NautiExpression =
  | 'normal'
  | 'happy'
  | 'celebrate'
  | 'danger'
  | 'surprised'
  | 'thinking';

export type NautiGaze =
  | 'center'
  | 'right'
  | 'up-right'
  | 'down-right'
  | 'up'
  | 'left';

export type NautiHandPose = 'none' | 'wave' | 'point-right' | 'point-up' | 'celebrate';

export type TickleIntensity = 'mild' | 'high';

interface NautiCharacterRigProps {
  expression?: NautiExpression;
  /** Temporary story-driven gaze override; when 'center' (default), smooth cursor/touch tracking takes over */
  gaze?: NautiGaze;
  handPose?: NautiHandPose;
  isSpeaking?: boolean;
  mouthPulse?: number;
  className?: string;
  stickerRim?: boolean;
  interactiveTickle?: boolean;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

const NAUTI_FACE_SRC = '/assets/aistudio/WhatsApp_Image_2026-11-14_at_9.06.59_PM_bc933091.jpeg';

let cachedTransparentUrlPromise: Promise<string> | null = null;

/**
 * Removes the pure-black exterior background and the isolated static mouth from
 * the official NAUTI JPEG once so the dark navy helmet, glasses, and ring remain intact.
 */
function getTransparentNautiUrl(): Promise<string> {
  if (cachedTransparentUrlPromise) return cachedTransparentUrlPromise;

  cachedTransparentUrlPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = 768;
        const h = 512;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(NAUTI_FACE_SRC);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const visited = new Uint8Array(w * h);

        const isOuterBlack = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          return r < 26 && g < 26 && b < 34 && b - r < 14;
        };

        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const seed = (x: number, y: number) => {
          const pos = y * w + x;
          if (!visited[pos] && isOuterBlack(pos * 4)) {
            visited[pos] = 1;
            queue[tail++] = pos;
          }
        };

        for (let x = 0; x < w; x++) {
          seed(x, 0);
          seed(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          seed(0, y);
          seed(w - 1, y);
        }

        while (head < tail) {
          const pos = queue[head++];
          const px = pos * 4;
          data[px + 3] = 0;

          const x = pos % w;
          const y = (pos - x) / w;

          if (x > 0) {
            const n = pos - 1;
            if (!visited[n] && isOuterBlack(n * 4)) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (x < w - 1) {
            const n = pos + 1;
            if (!visited[n] && isOuterBlack(n * 4)) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (y > 0) {
            const n = pos - w;
            if (!visited[n] && isOuterBlack(n * 4)) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
          if (y < h - 1) {
            const n = pos + w;
            if (!visited[n] && isOuterBlack(n * 4)) {
              visited[n] = 1;
              queue[tail++] = n;
            }
          }
        }

        // Subtle 1px edge soften for remaining dark fringe pixels adjacent to transparent
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const pos = y * w + x;
            const px = pos * 4;
            if (data[px + 3] === 0) continue;
            const r = data[px];
            const g = data[px + 1];
            const b = data[px + 2];
            if (r < 36 && g < 36 && b < 48 && b - r < 16) {
              if (
                visited[pos - 1] ||
                visited[pos + 1] ||
                visited[pos - w] ||
                visited[pos + w]
              ) {
                data[px + 3] = 75;
              }
            }
          }
        }

        // Cleanly erase the isolated static mouth (centered at x=384, y=358 in 768x512)
        const mouthMinX = 350;
        const mouthMaxX = 417;
        const mouthMinY = 340;
        const mouthMaxY = 386;
        const mouthVisited = new Uint8Array(w * h);
        const mQueue: number[] = [];

        for (let y = 345; y <= 375; y++) {
          for (let x = 365; x <= 403; x++) {
            const pos = y * w + x;
            const px = pos * 4;
            if (data[px] < 180 || data[px + 1] < 180 || data[px + 2] < 200) {
              if (!mouthVisited[pos]) {
                mouthVisited[pos] = 1;
                mQueue.push(pos);
              }
            }
          }
        }

        let mHead = 0;
        while (mHead < mQueue.length) {
          const pos = mQueue[mHead++];
          const px = pos * 4;
          data[px] = 255;
          data[px + 1] = 255;
          data[px + 2] = 255;
          data[px + 3] = 255;

          const x = pos % w;
          const y = (pos - x) / w;
          const neighbors = [
            x > mouthMinX ? pos - 1 : -1,
            x < mouthMaxX ? pos + 1 : -1,
            y > mouthMinY ? pos - w : -1,
            y < mouthMaxY ? pos + w : -1,
          ];
          for (const n of neighbors) {
            if (n >= 0 && !mouthVisited[n]) {
              const npx = n * 4;
              if (data[npx] < 244 || data[npx + 1] < 244 || data[npx + 2] < 248) {
                mouthVisited[n] = 1;
                mQueue.push(n);
              }
            }
          }
        }

        for (const pos of mQueue) {
          const x = pos % w;
          const y = (pos - x) / w;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= mouthMinX && nx <= mouthMaxX && ny >= mouthMinY && ny <= mouthMaxY) {
                const np = (ny * w + nx) * 4;
                data[np] = 255;
                data[np + 1] = 255;
                data[np + 2] = 255;
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(NAUTI_FACE_SRC);
          }
        }, 'image/png');
      } catch {
        resolve(NAUTI_FACE_SRC);
      }
    };
    img.onerror = () => resolve(NAUTI_FACE_SRC);
    img.src = NAUTI_FACE_SRC;
  });

  return cachedTransparentUrlPromise;
}

const STORY_GAZE_OFFSETS: Record<NautiGaze, { x: number; y: number }> = {
  center: { x: 0, y: 0 },
  right: { x: 32, y: 2 },
  'up-right': { x: 28, y: -30 },
  'down-right': { x: 28, y: 24 },
  up: { x: 2, y: -34 },
  left: { x: -30, y: 2 },
};

// Safe circular pupil travel radius in 1536x1024 space (lens radius is 124, pupil ry=65 -> max 36 keeps generous white margin)
const MAX_PUPIL_RADIUS = 36;

/**
 * Checks whether a pointer position lies on NAUTI's visible body (helmet + headphones + orbital ring),
 * ignoring transparent corners of the 1536x1024 image box.
 */
function isPointOnVisibleNauti(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): boolean {
  if (rect.width <= 0 || rect.height <= 0) return false;
  const nx = (clientX - rect.left) / rect.width;
  const ny = (clientY - rect.top) / rect.height;
  if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return false;

  // Main helmet & headphones silhouette centered at (0.50, 0.50)
  const inHelmet = ((nx - 0.5) / 0.3) ** 2 + ((ny - 0.5) / 0.39) ** 2 <= 1;
  // Orbital ring silhouette centered at (0.50, 0.65)
  const inRing = ((nx - 0.5) / 0.42) ** 2 + ((ny - 0.65) / 0.16) ** 2 <= 1;
  return inHelmet || inRing;
}

export const NautiCharacterRig: React.FC<NautiCharacterRigProps> = ({
  expression = 'normal',
  gaze = 'center',
  handPose: _handPose = 'none',
  isSpeaking = false,
  mouthPulse = 0,
  className = '',
  stickerRim = true,
  interactiveTickle = true,
  onTickleSound,
}) => {
  const [faceUrl, setFaceUrl] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [mouthFrame, setMouthFrame] = useState<number>(0);
  const [tickleIntensity, setTickleIntensity] = useState<TickleIntensity | null>(null);
  const [tickleSquint, setTickleSquint] = useState<boolean>(false);
  const [tickleMouthFrame, setTickleMouthFrame] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const onTickleSoundRef = useRef(onTickleSound);
  onTickleSoundRef.current = onTickleSound;

  const tickleTrackerRef = useRef({
    lastX: null as number | null,
    lastY: null as number | null,
    prevDx: 0,
    lastTime: 0,
    accumDist: 0,
    reversals: 0,
    lastActiveAt: 0,
    endTimer: null as number | null,
    leaveTimer: null as number | null,
  });

  // Sync latest story props to refs so rAF never restarts on every render
  const gazeOverrideRef = useRef<NautiGaze>(gaze);
  gazeOverrideRef.current = gaze;
  const expressionRef = useRef<NautiExpression>(expression);
  expressionRef.current = expression;

  useEffect(() => {
    let active = true;
    getTransparentNautiUrl().then((url) => {
      if (active) setFaceUrl(url);
    });
    return () => {
      active = false;
    };
  }, []);

  // Organic randomized natural blink cycle (with occasional double-blink)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let timeoutId: number;
    let closeId: number;
    let doubleId: number;
    let doubleCloseId: number;

    const scheduleBlink = () => {
      const wait = 2400 + Math.random() * 2900;
      timeoutId = window.setTimeout(() => {
        setIsBlinking(true);
        closeId = window.setTimeout(() => {
          setIsBlinking(false);
          if (Math.random() < 0.24) {
            doubleId = window.setTimeout(() => {
              setIsBlinking(true);
              doubleCloseId = window.setTimeout(() => setIsBlinking(false), 115);
            }, 135);
          }
          scheduleBlink();
        }, 120);
      }, wait);
    };

    scheduleBlink();
    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(closeId);
      window.clearTimeout(doubleId);
      window.clearTimeout(doubleCloseId);
    };
  }, []);

  // Mouth lip-sync frame cycling when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthFrame(0);
      return;
    }
    const id = window.setInterval(() => {
      setMouthFrame((f) => (f + 1) % 4);
    }, 130);
    return () => window.clearInterval(id);
  }, [isSpeaking]);

  useEffect(() => {
    if (isSpeaking && mouthPulse > 0) {
      setMouthFrame((f) => (f + 1) % 4);
    }
  }, [isSpeaking, mouthPulse]);

  // Playful eye squints & joyful open laugh animation while tickled
  useEffect(() => {
    if (!tickleIntensity) {
      setTickleSquint(false);
      setTickleMouthFrame(0);
      return;
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTickleSquint(true);
      setTickleMouthFrame(1);
      return;
    }

    setTickleSquint(true);
    setTickleMouthFrame(1);
    let step = 0;
    const intervalMs = tickleIntensity === 'high' ? 185 : 240;
    const id = window.setInterval(() => {
      step += 1;
      setTickleSquint(step % 3 !== 2);
      setTickleMouthFrame(step % 2);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [tickleIntensity]);

  // Clean up tickle timers on unmount
  useEffect(() => {
    const tracker = tickleTrackerRef.current;
    return () => {
      if (tracker.endTimer !== null) window.clearTimeout(tracker.endTimer);
      if (tracker.leaveTimer !== null) window.clearTimeout(tracker.leaveTimer);
    };
  }, []);

  // Smooth rAF Cursor + Touch + Autonomous Idle Eye Tracking (zero React re-renders per frame)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const state = {
      pointerX: 0,
      pointerY: 0,
      prevPointerX: 0,
      prevPointerY: 0,
      prevPointerTime: 0,
      hasActivePointer: false,
      pointerType: isCoarsePointer ? 'touch' : 'mouse',
      cursorLeftWindow: false,
      hoveringInteractive: false,
      touchUntil: 0,
      fastSweepUntil: 0,
      lastInputTime: performance.now(),
      // Autonomous idle glance targets (used gently on touchscreens / when untouched)
      idleX: 0,
      idleY: 0,
      nextIdleAt: performance.now() + 2600,
      // Smoothly interpolated current values
      curX: 0,
      curY: 0,
      curScale: 1,
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - state.prevPointerTime);

      if (state.prevPointerTime > 0) {
        const distMoved = Math.hypot(
          e.clientX - state.prevPointerX,
          e.clientY - state.prevPointerY,
        );
        const speed = distMoved / dt; // px per ms
        if (speed > 2.15) {
          state.fastSweepUntil = now + 420;
        }
      }

      state.prevPointerX = e.clientX;
      state.prevPointerY = e.clientY;
      state.prevPointerTime = now;

      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
      state.pointerType = e.pointerType || 'mouse';
      state.hasActivePointer = true;
      state.cursorLeftWindow = false;
      state.lastInputTime = now;

      if (e.pointerType === 'touch') {
        state.touchUntil = now + 2200;
      }

      const targetEl = e.target as Element | null;
      state.hoveringInteractive = Boolean(
        targetEl?.closest?.('button, [role="radio"], a, input, select'),
      );
    };

    const handlePointerDown = (e: PointerEvent) => {
      const now = performance.now();
      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
      state.pointerType = e.pointerType || 'touch';
      state.hasActivePointer = true;
      state.cursorLeftWindow = false;
      state.lastInputTime = now;

      if (e.pointerType === 'touch') {
        state.touchUntil = now + 2200;
      }
    };

    const handleMouseLeaveWindow = () => {
      state.hasActivePointer = false;
      state.cursorLeftWindow = true;
      state.hoveringInteractive = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeaveWindow);
    window.addEventListener('blur', handleMouseLeaveWindow);

    let rafId = 0;

    const tick = (now: number) => {
      const overrideGaze = gazeOverrideRef.current;
      const expr = expressionRef.current;

      let targetX = 0;
      let targetY = 0;
      let targetScale =
        expr === 'surprised' ? 1.12 : expr === 'danger' ? 0.9 : 1;

      if (overrideGaze !== 'center') {
        // Priority rule: temporary story-driven animation overrides cursor tracking
        const preset = STORY_GAZE_OFFSETS[overrideGaze];
        targetX = preset.x;
        targetY = preset.y;
      } else {
        const touchStillActive =
          state.pointerType === 'touch' && now < state.touchUntil;
        const mouseActive =
          state.pointerType !== 'touch' && state.hasActivePointer && !state.cursorLeftWindow;

        if ((mouseActive || touchStillActive) && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Eye line sits at x=50%, y=56.25% (768/1536, 576/1024) of the official NAUTI face
            const faceCenterX = rect.left + rect.width * 0.5;
            const faceCenterY = rect.top + rect.height * 0.5625;

            const dxPx = state.pointerX - faceCenterX;
            const dyPx = state.pointerY - faceCenterY;
            const distPx = Math.hypot(dxPx, dyPx);

            // Smooth asymptotic saturation curve so close & far cursor moves both read cleanly
            const reachRef = Math.max(150, Math.min(340, Math.max(rect.width, rect.height) * 1.45));
            const normalizedMag = Math.tanh(distPx / reachRef);

            if (distPx > 1) {
              const ux = dxPx / distPx;
              const uy = dyPx / distPx;
              targetX = ux * MAX_PUPIL_RADIUS * normalizedMag;
              targetY = uy * MAX_PUPIL_RADIUS * normalizedMag;
            }

            // Slightly widen eyes when cursor approaches NAUTI's face
            if (distPx < rect.width * 0.85) {
              targetScale += 0.08;
            }
            // Subtle curious dilation when hovering interactive buttons
            if (state.hoveringInteractive) {
              targetScale += 0.04;
            }
            // Playful reaction to quick cursor movement
            if (now < state.fastSweepUntil) {
              targetScale += 0.09;
            }
          }
        } else if (state.cursorLeftWindow) {
          // Cursor left app: return naturally to neutral (0, 0)
          targetX = 0;
          targetY = 0;
        } else if (isCoarsePointer || now - state.lastInputTime > 3800) {
          // Autonomous gentle idle curiosity on touchscreen / untouched view
          if (now >= state.nextIdleAt) {
            const idlePool = [
              { x: 0, y: 0 },
              { x: 14, y: -8 },
              { x: -12, y: 4 },
              { x: 10, y: 8 },
              { x: 0, y: 0 },
            ];
            const pick = idlePool[Math.floor(Math.random() * idlePool.length)];
            state.idleX = pick.x;
            state.idleY = pick.y;
            state.nextIdleAt = now + 2500 + Math.random() * 2200;
          }
          targetX = state.idleX;
          targetY = state.idleY;
        }
      }

      // Clamp radially inside safe eye boundaries
      const mag = Math.hypot(targetX, targetY);
      if (mag > MAX_PUPIL_RADIUS) {
        const s = MAX_PUPIL_RADIUS / mag;
        targetX *= s;
        targetY *= s;
      }

      // Smooth LERP interpolation (never snapping)
      const ease = 0.14;
      state.curX += (targetX - state.curX) * ease;
      state.curY += (targetY - state.curY) * ease;
      state.curScale += (targetScale - state.curScale) * 0.12;

      const xStr = state.curX.toFixed(2);
      const yStr = state.curY.toFixed(2);
      const sStr = state.curScale.toFixed(3);
      const transformVal = `translate(${xStr}px, ${yStr}px) scale(${sStr})`;

      if (leftPupilRef.current) {
        leftPupilRef.current.style.transform = transformVal;
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.style.transform = transformVal;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeaveWindow);
      window.removeEventListener('blur', handleMouseLeaveWindow);
    };
  }, []);

  const activateTickleBurst = (intensity: TickleIntensity, durationMs: number) => {
    const t = tickleTrackerRef.current;
    if (t.leaveTimer !== null) {
      window.clearTimeout(t.leaveTimer);
      t.leaveTimer = null;
    }
    if (t.endTimer !== null) {
      window.clearTimeout(t.endTimer);
    }
    t.lastActiveAt = performance.now();
    setTickleIntensity((prev) =>
      prev === 'high' && intensity === 'mild' ? 'high' : intensity,
    );
    t.endTimer = window.setTimeout(() => {
      setTickleIntensity(null);
      t.accumDist = 0;
      t.reversals = 0;
      t.endTimer = null;
    }, durationMs);

    onTickleSoundRef.current?.(intensity);
  };

  const scheduleGentleReturnToIdle = () => {
    const t = tickleTrackerRef.current;
    t.lastX = null;
    t.lastY = null;
    t.prevDx = 0;
    t.accumDist = 0;
    t.reversals = 0;
    if (t.leaveTimer !== null) {
      window.clearTimeout(t.leaveTimer);
    }
    t.leaveTimer = window.setTimeout(() => {
      if (t.endTimer !== null) {
        window.clearTimeout(t.endTimer);
        t.endTimer = null;
      }
      setTickleIntensity(null);
      t.leaveTimer = null;
    }, 260);
  };

  const handleRigPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveTickle || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!isPointOnVisibleNauti(e.clientX, e.clientY, rect)) {
      if (tickleIntensity !== null) {
        scheduleGentleReturnToIdle();
      } else {
        tickleTrackerRef.current.lastX = null;
        tickleTrackerRef.current.accumDist = 0;
      }
      return;
    }

    const t = tickleTrackerRef.current;
    const now = performance.now();
    if (t.lastX === null || t.lastY === null) {
      t.lastX = e.clientX;
      t.lastY = e.clientY;
      t.lastTime = now;
      return;
    }

    const dx = e.clientX - t.lastX;
    const dy = e.clientY - t.lastY;
    const dist = Math.hypot(dx, dy);
    if (dist < 2.5) return; // Ignore stationary micro-jitter

    const dt = Math.max(8, now - t.lastTime);
    const speed = dist / dt;

    if (t.prevDx !== 0 && dx * t.prevDx < -4) {
      t.reversals = Math.min(8, t.reversals + 1);
    } else if (now - t.lastTime > 420) {
      t.reversals = 0;
    }

    t.prevDx = dx;
    t.lastX = e.clientX;
    t.lastY = e.clientY;
    t.lastTime = now;
    t.accumDist += dist;

    // Require genuine cursor movement across NAUTI's body before triggering
    if (t.accumDist >= 16) {
      const intensity: TickleIntensity =
        t.reversals >= 2 || speed > 0.72 ? 'high' : 'mild';
      activateTickleBurst(intensity, intensity === 'high' ? 1650 : 1300);
      t.accumDist = 0;
    }
  };

  const handleRigPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveTickle || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!isPointOnVisibleNauti(e.clientX, e.clientY, rect)) return;

    const t = tickleTrackerRef.current;
    const now = performance.now();
    t.lastX = e.clientX;
    t.lastY = e.clientY;
    t.lastTime = now;

    // On touch devices (or clicking NAUTI gently), trigger a cute tickle burst immediately
    const recentTap = now - t.lastActiveAt < 1800;
    const intensity: TickleIntensity = recentTap ? 'high' : 'mild';
    activateTickleBurst(intensity, intensity === 'high' ? 1650 : 1300);
  };

  const handleRigPointerLeave = () => {
    if (!interactiveTickle) return;
    scheduleGentleReturnToIdle();
  };

  const isTickled = tickleIntensity !== null;
  const isDanger = expression === 'danger';
  const isHappy = expression === 'happy' || expression === 'celebrate' || isTickled;
  const isSurprised = expression === 'surprised';
  const isThinking = expression === 'thinking';

  const floatClass =
    tickleIntensity === 'high'
      ? 'anim-nauti-tickle-high'
      : tickleIntensity === 'mild'
        ? 'anim-nauti-tickle'
        : expression === 'celebrate'
          ? 'anim-nauti-celebrate'
          : isDanger
            ? 'anim-nauti-worry'
            : 'anim-nauti-float';

  const stickerFilter = stickerRim
    ? 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 2px #ffffff) drop-shadow(0 8px 18px rgba(4, 16, 41, 0.55))'
    : 'drop-shadow(0 8px 18px rgba(4, 16, 41, 0.55))';

  const showPlayfulEyelids = isBlinking || (isTickled && tickleSquint);

  return (
    <div
      ref={containerRef}
      onPointerMove={handleRigPointerMove}
      onPointerDown={handleRigPointerDown}
      onPointerLeave={handleRigPointerLeave}
      onPointerCancel={handleRigPointerLeave}
      className={`relative aspect-[1536/1024] select-none transition-opacity duration-150 ${
        faceUrl ? 'opacity-100' : 'opacity-0'
      } ${floatClass} ${className}`}
      style={{ filter: stickerFilter, touchAction: 'manipulation' }}
    >
      {/* Official NAUTI illustration with exterior black and static mouth cleaned */}
      {faceUrl && (
        <img
          src={faceUrl}
          alt="NAUTI, compañero de exploración lunar"
          className="block h-full w-full object-contain"
          draggable={false}
        />
      )}

      {/* Independent facial layers aligned to 1536x1024 (no extra eyebrows, cheeks, or hands) */}
      <svg
        viewBox="0 0 1536 1024"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="nautiLeftLensClip">
            <circle cx="608" cy="570" r="124" />
          </clipPath>
          <clipPath id="nautiRightLensClip">
            <circle cx="928" cy="570" r="124" />
          </clipPath>
        </defs>

        {/* 1. CLEAN WHITE LENS BACKING (preserves original glasses rim & white eye region) */}
        <circle cx="608" cy="570" r="124" fill="#ffffff" />
        <circle cx="928" cy="570" r="124" fill="#ffffff" />

        {/* 2. INDEPENDENT CURSOR-TRACKING PUPILS LAYER */}
        <g clipPath="url(#nautiLeftLensClip)">
          <g
            ref={leftPupilRef}
            style={{
              transformOrigin: '624px 576px',
            }}
          >
            <ellipse cx="624" cy="576" rx="52" ry="65" fill="#082458" />
            <circle cx="653" cy="546" r="19" fill="#ffffff" />
          </g>
        </g>

        <g clipPath="url(#nautiRightLensClip)">
          <g
            ref={rightPupilRef}
            style={{
              transformOrigin: '912px 576px',
            }}
          >
            <ellipse cx="912" cy="576" rx="52" ry="65" fill="#082458" />
            <circle cx="941" cy="546" r="19" fill="#ffffff" />
          </g>
        </g>

        {/* 3. NATURAL & PLAYFUL TICKLED BLINKING / SQUINTING EYELIDS LAYER */}
        {showPlayfulEyelids && (
          <g>
            <circle cx="608" cy="570" r="125" fill="#ffffff" />
            <circle cx="928" cy="570" r="125" fill="#ffffff" />
            <path
              d={
                isHappy
                  ? 'M 544 582 Q 608 524 672 582'
                  : 'M 544 570 Q 608 610 672 570'
              }
              fill="none"
              stroke="#082458"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d={
                isHappy
                  ? 'M 864 582 Q 928 524 992 582'
                  : 'M 864 570 Q 928 610 992 570'
              }
              fill="none"
              stroke="#082458"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. CLEAN KAWAII U-SHAPED MOUTH LAYER (narration lip-sync always takes priority) */}
        {isSpeaking ? (
          <g>
            {mouthFrame === 0 && (
              <path
                d="M 744 704 L 792 704 Q 800 704 800 712 C 800 740 786 752 768 752 C 750 752 736 740 736 712 Q 736 704 744 704 Z"
                fill="#082458"
              />
            )}
            {mouthFrame === 1 && (
              <g>
                <path
                  d="M 732 698 L 804 698 Q 814 698 814 708 C 814 746 794 764 768 764 C 742 764 722 746 722 708 Q 722 698 732 698 Z"
                  fill="#082458"
                />
                <ellipse cx="768" cy="744" rx="22" ry="11" fill="#ff7aa2" />
              </g>
            )}
            {mouthFrame === 2 && (
              <ellipse cx="768" cy="728" rx="24" ry="21" fill="#082458" />
            )}
            {mouthFrame === 3 && (
              <g>
                <path
                  d="M 738 702 L 798 702 Q 806 702 806 710 C 806 742 790 756 768 756 C 746 756 730 742 730 710 Q 730 702 738 702 Z"
                  fill="#082458"
                />
                <ellipse cx="768" cy="740" rx="18" ry="8" fill="#ff7aa2" />
              </g>
            )}
          </g>
        ) : isTickled ? (
          <g>
            {tickleMouthFrame === 0 ? (
              <g>
                <path
                  d="M 724 694 L 812 694 Q 822 694 822 705 C 822 749 799 769 768 769 C 737 769 714 749 714 705 Q 714 694 724 694 Z"
                  fill="#082458"
                />
                <ellipse cx="768" cy="748" rx="27" ry="12" fill="#ff7aa2" />
              </g>
            ) : (
              <g>
                <path
                  d="M 728 697 L 808 697 Q 817 697 817 707 C 817 746 796 764 768 764 C 740 764 719 746 719 707 Q 719 697 728 697 Z"
                  fill="#082458"
                />
                <ellipse cx="768" cy="744" rx="23" ry="10" fill="#ff7aa2" />
              </g>
            )}
          </g>
        ) : isHappy ? (
          <g>
            <path
              d="M 730 698 L 806 698 Q 816 698 816 708 C 816 746 795 764 768 764 C 741 764 720 746 720 708 Q 720 698 730 698 Z"
              fill="#082458"
            />
            <ellipse cx="768" cy="744" rx="24" ry="11" fill="#ff7aa2" />
          </g>
        ) : isDanger ? (
          <path
            d="M 744 736 Q 768 714 792 736"
            fill="none"
            stroke="#082458"
            strokeWidth="14"
            strokeLinecap="round"
          />
        ) : isSurprised ? (
          <ellipse cx="768" cy="728" rx="23" ry="27" fill="#082458" />
        ) : isThinking ? (
          <path
            d="M 746 718 Q 768 738 790 718"
            fill="none"
            stroke="#082458"
            strokeWidth="13"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 736 701 L 800 701 Q 808 701 808 709 C 808 743 790 757 768 757 C 746 757 728 743 728 709 Q 728 701 736 701 Z"
            fill="#082458"
          />
        )}
      </svg>
    </div>
  );
};
