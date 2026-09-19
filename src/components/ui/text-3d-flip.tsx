import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ElementType,
} from 'react';
import { useAnimate } from 'motion/react';
import { cn } from '@/lib/utils';

const HAS_SEGMENTER = typeof Intl !== 'undefined' && 'Segmenter' in Intl;

const splitIntoCharacters = (text: string): string[] => {
  if (HAS_SEGMENTER) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

export interface TextSegment {
  text: string;
  className?: string;
  flipClassName?: string;
}

const extractSegments = (
  node: React.ReactNode,
  parentClass?: string,
  parentFlipClass?: string
): TextSegment[] => {
  if (node == null || node === false || node === true) return [];
  if (typeof node === 'string' || typeof node === 'number') {
    return [
      {
        text: String(node),
        className: parentClass,
        flipClassName: parentFlipClass,
      },
    ];
  }
  if (Array.isArray(node)) {
    return node.flatMap((child) =>
      extractSegments(child, parentClass, parentFlipClass)
    );
  }
  if (React.isValidElement(node)) {
    const props = node.props as {
      className?: string;
      flipClassName?: string;
      children?: React.ReactNode;
    };
    const nodeClass = props.className
      ? parentClass
        ? `${parentClass} ${props.className}`
        : props.className
      : parentClass;
    const nodeFlipClass = props.flipClassName || parentFlipClass;
    return extractSegments(props.children, nodeClass, nodeFlipClass);
  }
  return [];
};

const ROTATION_MAP = {
  top: 'rotateX(90deg)',
  right: 'rotateY(90deg)',
  bottom: 'rotateX(-90deg)',
  left: 'rotateY(-90deg)',
} as const;

const DEFAULT_TRANSITION = {
  type: 'spring',
  damping: 25,
  stiffness: 160,
} as const;

export interface Text3DFlipProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | number | 'random';
  transition?: any;
  rotateDirection?: 'top' | 'right' | 'bottom' | 'left';
}

interface CharInfo {
  char: string;
  className?: string;
  flipClassName?: string;
  style?: React.CSSProperties;
}

interface WordInfo {
  characters: CharInfo[];
  needsSpace: boolean;
}

export const Text3DFlip = ({
  children,
  as: ElementTag = 'span',
  className,
  textClassName,
  flipTextClassName,
  staggerDuration = 0.025,
  staggerFrom = 'first',
  transition = DEFAULT_TRANSITION,
  rotateDirection = 'top',
  ...props
}: Text3DFlipProps) => {
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(false);
  const [scope, animate] = useAnimate();

  const rotationTransform = ROTATION_MAP[rotateDirection];

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isAnimatingRef.current = false;
    };
  }, []);

  // Parse segments preserving any <span className="..."> or child structures
  const segments = useMemo(() => {
    return extractSegments(children);
  }, [children]);

  // Build words and characters with respective classes and continuous gradients
  const words = useMemo(() => {
    const result: WordInfo[] = [];
    let currentWordChars: CharInfo[] = [];

    for (let sIdx = 0; sIdx < segments.length; sIdx++) {
      const seg = segments[sIdx];
      const isGradient = seg.className?.includes('gradient-text');
      const segText = seg.text;
      const segChars = splitIntoCharacters(segText);
      const totalSegChars = segChars.length;

      for (let cIdx = 0; cIdx < totalSegChars; cIdx++) {
        const char = segChars[cIdx];
        if (char === ' ') {
          if (currentWordChars.length > 0) {
            result.push({ characters: currentWordChars, needsSpace: true });
            currentWordChars = [];
          } else if (result.length > 0) {
            result[result.length - 1].needsSpace = true;
          }
        } else {
          let charStyle: React.CSSProperties | undefined = undefined;
          if (isGradient) {
            // Optical continuous gradient across all characters in the segment
            charStyle = {
              backgroundSize: `${Math.max(1, totalSegChars) * 100}% 100%`,
              backgroundPosition: `${(cIdx / Math.max(1, totalSegChars - 1)) * 100}% 0%`,
            };
          }

          currentWordChars.push({
            char,
            className: seg.className || textClassName,
            flipClassName:
              seg.flipClassName ||
              (isGradient
                ? `${seg.className} brightness-125 saturate-125`
                : flipTextClassName),
            style: charStyle,
          });
        }
      }
    }

    if (currentWordChars.length > 0) {
      result.push({ characters: currentWordChars, needsSpace: false });
    }

    return result;
  }, [segments, textClassName, flipTextClassName]);

  const rawText = useMemo(() => {
    return segments.map((s) => s.text).join('');
  }, [segments]);

  const charOffsets = useMemo(() => {
    const offsets = [0];
    for (const word of words) {
      offsets.push((offsets.at(-1) ?? 0) + word.characters.length);
    }
    return offsets;
  }, [words]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last')
        return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * totalChars);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs((typeof staggerFrom === 'number' ? staggerFrom : 0) - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleHoverStart = useCallback(async () => {
    if (isAnimatingRef.current || !scope.current) return;
    isAnimatingRef.current = true;

    try {
      const totalChars = words.reduce(
        (sum, word) => sum + word.characters.length,
        0
      );

      const delays = Array.from({ length: totalChars }, (_, i) =>
        getStaggerDelay(i, totalChars)
      );

      // Rotate to show flip face
      await animate(
        '.text-3d-flip-char',
        { transform: rotationTransform },
        {
          ...transition,
          delay: (i: number) => delays[i],
        }
      );

      if (!isMountedRef.current) return;

      // Hold flip face momentarily
      await new Promise((resolve) => setTimeout(resolve, 550));
      if (!isMountedRef.current) return;

      // Smoothly return back to the static front face
      await animate(
        '.text-3d-flip-char',
        { transform: 'rotateX(0deg) rotateY(0deg)' },
        {
          ...transition,
          delay: (i: number) => delays[i],
        }
      );
    } finally {
      if (isMountedRef.current) {
        isAnimatingRef.current = false;
      }
    }
  }, [words, transition, getStaggerDelay, rotationTransform, animate, scope]);

  return (
    <ElementTag
      className={cn(
        'relative inline-flex flex-wrap items-baseline cursor-pointer select-none [perspective:1000px]',
        className
      )}
      onMouseEnter={handleHoverStart}
      onTouchStart={handleHoverStart}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{rawText}</span>

      {words.map((wordObj, wordIndex) => (
        <span key={wordIndex} className="inline-flex items-baseline whitespace-nowrap">
          {wordObj.characters.map((charObj, charIndex) => (
            <CharBox
              key={charOffsets[wordIndex] + charIndex}
              char={charObj.char}
              textClassName={charObj.className}
              flipTextClassName={charObj.flipClassName}
              style={charObj.style}
              rotateDirection={rotateDirection}
            />
          ))}
          {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
        </span>
      ))}
    </ElementTag>
  );
};

interface CharBoxProps {
  char: string;
  textClassName?: string;
  flipTextClassName?: string;
  style?: React.CSSProperties;
  rotateDirection: 'top' | 'right' | 'bottom' | 'left';
}

const SECOND_FACE_TRANSFORMS = {
  top: 'rotateX(-90deg) translateZ(0.5em)',
  right:
    'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)',
  bottom: 'rotateX(90deg) translateZ(0.5em)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)',
} as const;

const FRONT_FACE_TRANSFORMS = {
  top: 'translateZ(0.5em)',
  bottom: 'translateZ(0.5em)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
  right: 'rotateY(-90deg) translateX(50%) rotateY(90deg)',
} as const;

const CONTAINER_TRANSFORMS = {
  top: 'translateZ(-0.5em)',
  bottom: 'translateZ(-0.5em)',
  left: 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
  right: 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
} as const;

const CharBox = memo(
  ({
    char,
    textClassName,
    flipTextClassName,
    style,
    rotateDirection,
  }: CharBoxProps) => (
    <span
      className="text-3d-flip-char inline-block transform-3d will-change-transform"
      style={{ transform: CONTAINER_TRANSFORMS[rotateDirection] }}
    >
      <span
        className={cn('relative inline-block h-[1.2em] leading-normal backface-hidden', textClassName)}
        style={{ ...style, transform: FRONT_FACE_TRANSFORMS[rotateDirection] }}
      >
        {char}
      </span>
      <span
        className={cn(
          'absolute top-0 left-0 inline-block h-[1.2em] leading-normal backface-hidden',
          flipTextClassName
        )}
        style={{ ...style, transform: SECOND_FACE_TRANSFORMS[rotateDirection] }}
      >
        {char}
      </span>
    </span>
  )
);

CharBox.displayName = 'CharBox';
Text3DFlip.displayName = 'Text3DFlip';

export default Text3DFlip;
