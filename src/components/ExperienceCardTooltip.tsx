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
import { Gamepad2, Info, Target, X } from 'lucide-react';

export type ExperienceTooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipTriggerMode = 'hover' | 'focus' | 'touch';

interface ExperienceTooltipContextValue {
  activeId: string | null;
  openMode: TooltipTriggerMode | null;
  openTooltip: (id: string, mode: TooltipTriggerMode) => void;
  closeTooltip: (id?: string) => void;
  toggleTouchTooltip: (id: string) => void;
  isKeyboardNav: () => boolean;
}

const ExperienceTooltipContext =
  createContext<ExperienceTooltipContextValue | null>(null);

export const ExperienceCardTooltipProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openMode, setOpenMode] = useState<TooltipTriggerMode | null>(null);
  const lastKeyboardNavRef = useRef<boolean>(false);

  const openTooltip = useCallback((id: string, mode: TooltipTriggerMode) => {
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

    const handlePointerDown = (e: PointerEvent) => {
      lastKeyboardNavRef.current = false;
      const target = e.target as Element | null;
      if (
        target?.closest?.('[data-exp-info-btn="true"]') ||
        target?.closest?.('[data-exp-tooltip-bubble="true"]')
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
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const isKeyboardNav = useCallback(() => lastKeyboardNavRef.current, []);

  const value = useMemo<ExperienceTooltipContextValue>(
    () => ({
      activeId,
      openMode,
      openTooltip,
      closeTooltip,
      toggleTouchTooltip,
      isKeyboardNav,
    }),
    [
      activeId,
      openMode,
      openTooltip,
      closeTooltip,
      toggleTouchTooltip,
      isKeyboardNav,
    ],
  );

  return (
    <ExperienceTooltipContext.Provider value={value}>
      {children}
    </ExperienceTooltipContext.Provider>
  );
};

export interface ExperienceTooltipLabels {
  whatStudentsLearn: string;
  interactiveActivity: string;
  plannedActivityPrefix: string;
  infoAria: string;
  closeAria: string;
}

interface ExperienceCardTooltipProps {
  title: string;
  description: string;
  learningObjective: string;
  interactiveActivity: string;
  statusLabel?: string;
  isPlanned?: boolean;
  labels: ExperienceTooltipLabels;
  preferredSide?: ExperienceTooltipSide;
  children: React.ReactNode;
}

export const ExperienceCardTooltip: React.FC<ExperienceCardTooltipProps> = ({
  title,
  description,
  learningObjective,
  interactiveActivity,
  statusLabel,
  isPlanned = false,
  labels,
  preferredSide = 'top',
  children,
}) => {
  const ctx = useContext(ExperienceTooltipContext);
  const id = useId();
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const closeTooltipRef = useRef(ctx?.closeTooltip);
  closeTooltipRef.current = ctx?.closeTooltip;

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    ready: boolean;
  }>({
    top: -9999,
    left: -9999,
    ready: false,
  });

  const isOpen = Boolean(ctx && ctx.activeId === id);
  const isTouchOpen = Boolean(isOpen && ctx?.openMode === 'touch');

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      closeTooltipRef.current?.(id);
    };
  }, [clearTimers, id]);

  const computePosition = useCallback(() => {
    const anchorEl = cardWrapperRef.current;
    const bubbleEl = bubbleRef.current;
    if (!anchorEl || !bubbleEl || typeof window === 'undefined') return;

    const aRect = anchorEl.getBoundingClientRect();
    const bRect = bubbleEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    const gap = 8;

    const fitsSide = (side: ExperienceTooltipSide): boolean => {
      if (side === 'top') return aRect.top - gap - bRect.height >= margin;
      if (side === 'bottom')
        return aRect.bottom + gap + bRect.height <= vh - margin;
      if (side === 'left') return aRect.left - gap - bRect.width >= margin;
      return aRect.right + gap + bRect.width <= vw - margin;
    };

    const orderMap: Record<ExperienceTooltipSide, ExperienceTooltipSide[]> = {
      top: ['top', 'bottom', 'right', 'left'],
      bottom: ['bottom', 'top', 'right', 'left'],
      left: ['left', 'right', 'top', 'bottom'],
      right: ['right', 'left', 'top', 'bottom'],
    };

    const chosenSide =
      orderMap[preferredSide].find((side) => fitsSide(side)) ?? preferredSide;

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

    const clampedLeft = Math.max(
      margin,
      Math.min(vw - bRect.width - margin, left),
    );
    const clampedTop = Math.max(
      margin,
      Math.min(vh - bRect.height - margin, top),
    );

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
  }, [isOpen, title, description, computePosition]);

  const handleCardPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ctx || e.pointerType === 'touch') return;
    clearTimers();
    if (ctx.activeId === id && ctx.openMode === 'touch') return;
    openTimerRef.current = window.setTimeout(() => {
      ctx.openTooltip(id, 'hover');
    }, 110);
  };

  const handleCardPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ctx || e.pointerType === 'touch') return;
    clearTimers();
    if (ctx.activeId === id && ctx.openMode === 'touch') return;
    closeTimerRef.current = window.setTimeout(() => {
      ctx.closeTooltip(id);
    }, 110);
  };

  const handleBubblePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ctx || e.pointerType === 'touch') return;
    clearTimers();
  };

  const handleBubblePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ctx || e.pointerType === 'touch') return;
    if (ctx.activeId === id && ctx.openMode === 'touch') return;
    clearTimers();
    closeTimerRef.current = window.setTimeout(() => {
      ctx.closeTooltip(id);
    }, 100);
  };

  const handleFocusCapture = () => {
    if (!ctx || !ctx.isKeyboardNav()) return;
    clearTimers();
    openTimerRef.current = window.setTimeout(() => {
      ctx.openTooltip(id, 'focus');
    }, 120);
  };

  const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!ctx) return;
    const nextTarget = e.relatedTarget as Node | null;
    if (
      nextTarget &&
      (cardWrapperRef.current?.contains(nextTarget) ||
        bubbleRef.current?.contains(nextTarget))
    ) {
      return;
    }
    clearTimers();
    if (ctx.openMode !== 'touch') {
      ctx.closeTooltip(id);
    }
  };

  const handleInfoTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!ctx) return;
    clearTimers();
    ctx.toggleTouchTooltip(id);
  };

  return (
    <div
      ref={cardWrapperRef}
      onPointerEnter={handleCardPointerEnter}
      onPointerLeave={handleCardPointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      className="relative flex h-full flex-col"
    >
      {children}

      {/* Compact (i) Info Button: primary tap trigger on touchscreens & accessible trigger */}
      <button
        type="button"
        data-exp-info-btn="true"
        aria-label={labels.infoAria}
        aria-expanded={isOpen}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleInfoTap}
        className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition active:scale-95 sm:top-2.5 sm:right-2.5 sm:h-8 sm:w-8 ${
          isOpen
            ? 'border-[#EAF4F2] bg-[#48C5B5] text-[#101D35] shadow-md'
            : 'border-[#48C5B5]/70 bg-[#101D35]/90 text-[#48C5B5] hover:border-[#F2C66D] hover:text-[#F2C66D]'
        }`}
      >
        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={bubbleRef}
            role="tooltip"
            data-exp-tooltip-bubble="true"
            onPointerEnter={handleBubblePointerEnter}
            onPointerLeave={handleBubblePointerLeave}
            className="pointer-events-auto fixed z-[210] w-[min(305px,calc(100vw-16px))]"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              visibility: coords.ready ? 'visible' : 'hidden',
            }}
          >
            <div
              className={`${
                coords.ready ? 'anim-tooltip-in' : ''
              } cockpit-scroll max-h-[calc(100dvh-16px)] overflow-y-auto rounded-2xl border-2 border-[#48C5B5] bg-[#101D35]/98 p-3 text-[#EAF4F2] shadow-[0_12px_28px_rgba(4,10,24,0.88)] backdrop-blur-md`}
            >
              {/* Header: Experience Name + Optional Status/Close Button */}
              <div className="flex items-start justify-between gap-2 border-b border-[#48C5B5]/25 pb-2">
                <div className="min-w-0">
                  {statusLabel && isPlanned && (
                    <span className="mb-0.5 block text-[10px] font-black tracking-wide text-[#F2C66D] uppercase">
                      {statusLabel}
                    </span>
                  )}
                  <h3 className="text-sm leading-tight font-black text-[#F2C66D]">
                    {title}
                  </h3>
                </div>

                {isTouchOpen && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTimers();
                      ctx?.closeTooltip(id);
                    }}
                    aria-label={labels.closeAria}
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-[#314975] bg-[#162747] text-[#EAF4F2]"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Short Educational Description */}
              <p className="mt-2 text-xs leading-snug font-semibold text-[#EAF4F2]">
                {description}
              </p>

              {/* Learning Objective */}
              <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-[#162747]/90 px-2.5 py-2 text-[11px] leading-snug">
                <Target
                  className="mt-0.5 h-3.5 w-3.5 flex-none text-[#48C5B5]"
                  aria-hidden="true"
                />
                <div>
                  <span className="block font-black text-[#48C5B5]">
                    {labels.whatStudentsLearn}
                  </span>
                  <span className="mt-0.5 block font-semibold text-[#EAF4F2]/95">
                    {learningObjective}
                  </span>
                </div>
              </div>

              {/* Interactive Activity */}
              <div className="mt-1.5 flex items-start gap-2 rounded-xl bg-[#162747]/90 px-2.5 py-2 text-[11px] leading-snug">
                <Gamepad2
                  className="mt-0.5 h-3.5 w-3.5 flex-none text-[#F2C66D]"
                  aria-hidden="true"
                />
                <div>
                  <span className="block font-black text-[#F2C66D]">
                    {labels.interactiveActivity}
                  </span>
                  <span className="mt-0.5 block font-semibold text-[#EAF4F2]/95">
                    {isPlanned && (
                      <strong className="mr-1 font-black text-[#F2C66D]">
                        {labels.plannedActivityPrefix}:
                      </strong>
                    )}
                    {interactiveActivity}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
