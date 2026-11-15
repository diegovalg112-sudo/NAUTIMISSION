import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipOpenMode = 'hover' | 'focus' | 'touch';

interface TooltipContextValue {
  activeId: string | null;
  openMode: TooltipOpenMode | null;
  isKeyboardNav: () => boolean;
  openTooltip: (id: string, mode: TooltipOpenMode) => void;
  closeTooltip: (id?: string) => void;
  toggleTouchTooltip: (id: string) => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openMode, setOpenMode] = useState<TooltipOpenMode | null>(null);
  const lastKeyboardNavRef = useRef<boolean>(false);

  const openTooltip = useCallback((id: string, mode: TooltipOpenMode) => {
    setActiveId(id);
    setOpenMode(mode);
  }, []);

  const closeTooltip = useCallback((id?: string) => {
    setActiveId((prev) => {
      if (!id || prev === id) {
        setOpenMode(null);
        return null;
      }
      return prev;
    });
  }, []);

  const toggleTouchTooltip = useCallback((id: string) => {
    setActiveId((prev) => {
      if (prev === id) {
        setOpenMode(null);
        return null;
      }
      setOpenMode('touch');
      return id;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Tab' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        lastKeyboardNavRef.current = true;
      }
      if (e.key === 'Escape') {
        setActiveId(null);
        setOpenMode(null);
      }
    };

    const handleGlobalPointerDown = (e: PointerEvent) => {
      lastKeyboardNavRef.current = false;
      const target = e.target as Element | null;
      if (
        target?.closest?.('[data-edu-info-btn="true"]') ||
        target?.closest?.('[data-edu-tooltip-tap-anchor="true"]') ||
        target?.closest?.('[data-edu-tooltip-action="true"]') ||
        target?.closest?.('[data-edu-tooltip-bubble="true"]')
      ) {
        return;
      }
      setActiveId(null);
      setOpenMode(null);
    };

    const handleScroll = () => {
      setActiveId((prev) => {
        if (prev === null) return prev;
        setOpenMode(null);
        return null;
      });
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handleGlobalPointerDown, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handleGlobalPointerDown, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const isKeyboardNav = useCallback(() => lastKeyboardNavRef.current, []);

  const value = useMemo<TooltipContextValue>(
    () => ({
      activeId,
      openMode,
      isKeyboardNav,
      openTooltip,
      closeTooltip,
      toggleTouchTooltip,
    }),
    [activeId, openMode, isKeyboardNav, openTooltip, closeTooltip, toggleTouchTooltip],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
};

export interface TooltipRenderHelpers {
  isOpen: boolean;
  openTouch: (e: React.SyntheticEvent) => void;
  triggerProps: {
    'data-edu-tooltip-trigger': 'true';
  };
}

interface EduTooltipProps {
  content: string;
  title?: string;
  preferredSide?: TooltipSide;
  hoverDelayMs?: number;
  className?: string;
  showInfoButton?: boolean;
  infoAriaLabel?: string;
  infoButtonClassName?: string;
  tapAnchorOpens?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode | ((helpers: TooltipRenderHelpers) => React.ReactNode);
}

export const EduTooltip: React.FC<EduTooltipProps> = ({
  content,
  title,
  preferredSide = 'top',
  hoverDelayMs = 300,
  className = 'relative inline-flex items-center gap-1',
  showInfoButton = false,
  infoAriaLabel = 'More information',
  infoButtonClassName = '',
  tapAnchorOpens = false,
  actionLabel,
  onAction,
  children,
}) => {
  const ctx = useContext(TooltipContext);
  const id = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const closeTooltipRef = useRef(ctx?.closeTooltip);
  closeTooltipRef.current = ctx?.closeTooltip;

  const [coords, setCoords] = useState<{ top: number; left: number; ready: boolean }>({
    top: -9999,
    left: -9999,
    ready: false,
  });

  const hasAction = Boolean(actionLabel && onAction);
  const hasContent = content.trim().length > 0;
  const isOpen = Boolean(hasContent && ctx && ctx.activeId === id);

  const clearTimers = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  // Only clear timers and close this tooltip when the component actually unmounts
  useEffect(() => {
    return () => {
      clearTimers();
      closeTooltipRef.current?.(id);
    };
  }, [clearTimers, id]);

  const computePosition = useCallback(() => {
    const anchorEl = anchorRef.current;
    const bubbleEl = bubbleRef.current;
    if (!anchorEl || !bubbleEl || typeof window === 'undefined') return;

    const aRect = anchorEl.getBoundingClientRect();
    const bRect = bubbleEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    const gap = 8;

    const fitsSide = (side: TooltipSide): boolean => {
      if (side === 'top') return aRect.top - gap - bRect.height >= margin;
      if (side === 'bottom') return aRect.bottom + gap + bRect.height <= vh - margin;
      if (side === 'left') return aRect.left - gap - bRect.width >= margin;
      return aRect.right + gap + bRect.width <= vw - margin;
    };

    const orderMap: Record<TooltipSide, TooltipSide[]> = {
      top: ['top', 'bottom', 'right', 'left'],
      bottom: ['bottom', 'top', 'right', 'left'],
      left: ['left', 'right', 'top', 'bottom'],
      right: ['right', 'left', 'top', 'bottom'],
    };

    const chosenSide =
      orderMap[preferredSide].find((s) => fitsSide(s)) ?? preferredSide;

    let top = 0;
    let left = 0;

    if (chosenSide === 'top') {
      top = aRect.top - gap - bRect.height;
      left = aRect.left + aRect.width / 2 - bRect.width / 2;
    } else if (chosenSide === 'bottom') {
      top = aRect.bottom + gap;
      left = aRect.left + aRect.width / 2 - bRect.width / 2;
    } else if (chosenSide === 'left') {
      top = aRect.top + aRect.height / 2 - bRect.height / 2;
      left = aRect.left - gap - bRect.width;
    } else {
      top = aRect.top + aRect.height / 2 - bRect.height / 2;
      left = aRect.right + gap;
    }

    const clampedLeft = Math.max(margin, Math.min(vw - bRect.width - margin, left));
    const clampedTop = Math.max(margin, Math.min(vh - bRect.height - margin, top));

    setCoords({
      top: Math.round(clampedTop),
      left: Math.round(clampedLeft),
      ready: true,
    });
  }, [preferredSide]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setCoords((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    computePosition();
    window.addEventListener('resize', computePosition);
    return () => {
      window.removeEventListener('resize', computePosition);
    };
  }, [isOpen, content, computePosition]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasContent || !ctx || e.pointerType === 'touch') return;
    clearTimers();
    if (ctx.activeId === id && ctx.openMode === 'touch') return;

    const target = e.target as Element | null;
    const isOverInfoBtn = Boolean(target?.closest?.('[data-edu-info-btn="true"]'));
    const delay = isOverInfoBtn ? Math.min(160, hoverDelayMs) : hoverDelayMs;

    hoverTimerRef.current = window.setTimeout(() => {
      ctx.openTooltip(id, 'hover');
    }, delay);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ctx || e.pointerType === 'touch') return;
    clearTimers();
    if (ctx.activeId === id && ctx.openMode === 'touch') return;

    leaveTimerRef.current = window.setTimeout(
      () => {
        ctx.closeTooltip(id);
      },
      hasAction ? 180 : 80,
    );
  };

  const handleBubblePointerEnter = () => {
    if (!hasAction || !ctx) return;
    clearTimers();
  };

  const handleBubblePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasAction || !ctx || e.pointerType === 'touch') return;
    if (ctx.activeId === id && ctx.openMode === 'touch') return;
    clearTimers();
    leaveTimerRef.current = window.setTimeout(() => {
      ctx.closeTooltip(id);
    }, 120);
  };

  const handleFocusCapture = () => {
    if (!hasContent || !ctx || !ctx.isKeyboardNav()) return;
    clearTimers();
    hoverTimerRef.current = window.setTimeout(() => {
      ctx.openTooltip(id, 'focus');
    }, 150);
  };

  const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!ctx) return;
    const nextTarget = e.relatedTarget as Node | null;
    if (nextTarget && anchorRef.current?.contains(nextTarget)) return;
    clearTimers();
    if (ctx.openMode !== 'touch') {
      ctx.closeTooltip(id);
    }
  };

  const toggleInfo = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      if (!hasContent || !ctx) return;
      clearTimers();
      ctx.toggleTouchTooltip(id);
    },
    [hasContent, ctx, clearTimers, id],
  );

  const handleAnchorClick = () => {
    if (!tapAnchorOpens || !hasContent || !ctx) return;
    clearTimers();
    ctx.toggleTouchTooltip(id);
  };

  const renderHelpers: TooltipRenderHelpers = {
    isOpen,
    openTouch: toggleInfo,
    triggerProps: {
      'data-edu-tooltip-trigger': 'true',
    },
  };

  return (
    <div
      ref={anchorRef}
      data-edu-tooltip-trigger="true"
      data-edu-tooltip-tap-anchor={tapAnchorOpens ? 'true' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onClick={tapAnchorOpens ? handleAnchorClick : undefined}
      className={className}
    >
      {typeof children === 'function' ? children(renderHelpers) : children}

      {showInfoButton && hasContent && (
        <button
          type="button"
          data-edu-info-btn="true"
          data-edu-tooltip-trigger="true"
          aria-label={infoAriaLabel}
          aria-expanded={isOpen}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={toggleInfo}
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border transition active:scale-95 ${
            isOpen
              ? 'border-[#34f0fa] bg-[#00d2e0] text-[#08265b] shadow-sm'
              : 'border-[#00d2e0]/60 bg-[#08265b]/85 text-[#9df8ff] hover:border-[#34f0fa] hover:bg-[#0e3a87] hover:text-white'
          } ${infoButtonClassName}`}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={bubbleRef}
            role="tooltip"
            data-edu-tooltip-bubble={hasAction ? 'true' : undefined}
            onPointerEnter={handleBubblePointerEnter}
            onPointerLeave={handleBubblePointerLeave}
            className={`${
              hasAction ? 'pointer-events-auto' : 'pointer-events-none'
            } fixed z-[200] max-w-[260px] sm:max-w-[295px]`}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              visibility: coords.ready ? 'visible' : 'hidden',
            }}
          >
            <div
              className={`${
                coords.ready ? 'anim-tooltip-in' : ''
              } flex items-start gap-2 rounded-xl border-2 border-[#34f0fa]/95 bg-[#071f4a]/98 px-3 py-2 text-[#f4fcff] shadow-[0_10px_24px_rgba(4,16,41,0.82)] backdrop-blur-md`}
            >
              <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-[#34f0fa]" />
              <div className="min-w-0">
                {title && (
                  <span className="mb-0.5 block text-[10px] font-black tracking-wide text-[#fde047] uppercase">
                    {title}
                  </span>
                )}
                <p className="m-0 text-[11px] leading-snug font-bold text-[#e6faff] sm:text-xs">
                  {content}
                </p>
                {hasAction && actionLabel && onAction && (
                  <button
                    type="button"
                    data-edu-tooltip-action="true"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTimers();
                      ctx?.closeTooltip(id);
                      onAction();
                    }}
                    className="mt-1.5 inline-flex min-h-[28px] items-center rounded-lg bg-[#48C5B5] px-2.5 py-0.5 text-[11px] font-black text-[#101D35] transition hover:brightness-110 active:scale-95"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
