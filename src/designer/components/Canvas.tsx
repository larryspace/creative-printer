import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { isNil } from 'lodash';
import { convertMMToPixel, convertPixelToPoint } from '@/components/LabelPrint/utils';
import { TemplateElement } from '../../types';
import { useTemplateDesign } from '../DesignContext';
import styles from './index.module.less';
import Decimal from 'decimal.js';
import elementRender from './utils';
type MoveTo = (x: number, y: number, from: {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}, id: number) => void;
export default function Index({
  width,
  height,
  style,
  containerRef
}: {
  width: number;
  height: number;
  style?: React.CSSProperties;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const {
    elementList,
    updateElement,
    activeElementId,
    updateActiveElementId
  } = useTemplateDesign();
  const [draging, setDraging] = useState(false);
  const moveTo = useCallback<MoveTo>((x, y, from, id) => {
    const {
      left,
      top,
      right,
      bottom
    } = from;
    const to: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    } = {};
    if (!isNil(x)) {
      const w = width * 2.834;
      if (!isNil(left) && isNil(right)) {
        to.left = new Decimal(Math.min(Math.max(convertPixelToPoint(x) + left, 0), w)).toDP(2).toNumber();
      }
      if (!isNil(right) && isNil(left)) {
        to.right = new Decimal(Math.min(Math.max(-convertPixelToPoint(x) + right, 0), w)).toDP(2).toNumber();
      }
    }
    if (!isNil(y)) {
      const h = height * 2.834;
      if (!isNil(top) && isNil(bottom)) {
        to.top = new Decimal(Math.min(Math.max(convertPixelToPoint(y) + top, 0), h)).toDP(2).toNumber();
      }
      if (!isNil(bottom) && isNil(top)) {
        to.bottom = new Decimal(Math.min(Math.max(-convertPixelToPoint(y) + bottom, 0), h)).toDP(2).toNumber();
      }
    }
    updateElement({
      ...to,
      id
    });
  }, [height, updateElement, width]);
  const handleKeyDown = useCallback(e => {
    if (!activeElementId) return;
    const element = elementList.find(i => i.id === activeElementId);
    if (!element) return;
    const {
      left,
      top,
      right,
      bottom
    } = element;
    const from = {
      left,
      top,
      right,
      bottom
    };
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.code)) return;
    const scale = e.shiftKey ? 10 : 1;
    if (e.code === 'ArrowDown') moveTo(0, 1 * scale, from, activeElementId);
    if (e.code === 'ArrowUp') moveTo(0, -1 * scale, from, activeElementId);
    if (e.code === 'ArrowRight') moveTo(1 * scale, 0, from, activeElementId);
    if (e.code === 'ArrowLeft') moveTo(-1 * scale, 0, from, activeElementId);
    e.preventDefault();
    e.stopPropagation();
  }, [activeElementId, elementList, moveTo]);
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, element: TemplateElement) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeElementId !== element.id) updateActiveElementId(element.id);
    setDraging(true);
    const {
      clientX,
      clientY
    } = e;
    const {
      left,
      top,
      right,
      bottom
    } = element;
    const onMove = (event: MouseEvent) => {
      const x = event.clientX - clientX;
      const y = event.clientY - clientY;
      moveTo(x, y, {
        left,
        top,
        right,
        bottom
      }, element.id);
    };
    const root = document.documentElement;
    const onCancel = () => {
      root.removeEventListener('mousemove', onMove, false);
      setDraging(false);
    };
    root.addEventListener('mousemove', onMove, {
      passive: true
    });
    root.addEventListener('mouseup', onCancel, {
      once: true,
      passive: true
    });
  }, [activeElementId, moveTo, updateActiveElementId]);
  const positionRef = useRef<{
    x: number;
    y: number;
  } | null>({
    x: 10,
    y: 32
  });
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
    transform: 'translate(10px, 64px)'
  });
  useEffect(() => {
    // 只需要在初始化时候执行一次
    if (!containerRef.current || positionRef.current || !width || !height) return;
    const {
      width: w,
      height: h
    } = containerRef.current?.getBoundingClientRect();
    const [x, y] = [Math.max((w - convertMMToPixel(width)) / 2, 10), Math.max((h - convertMMToPixel(height)) / 2, 10)];
    setCanvasStyle({
      transform: `translate(${x}px, ${y}px)`
    });
    positionRef.current = {
      x,
      y
    };
  }, [width, height]);
  const handleMoveCanvas = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      clientX,
      clientY
    } = e;
    if (!positionRef.current) return;
    const {
      x,
      y
    } = positionRef.current;
    const onMove = (event: MouseEvent) => {
      const translateX = x + event.clientX - clientX;
      const translateY = y + event.clientY - clientY;
      positionRef.current = {
        x: translateX,
        y: translateY
      };
      setCanvasStyle({
        transform: `translate(${translateX}px, ${translateY}px)`
      });
    };
    const root = document.documentElement;
    const onCancel = () => {
      root.removeEventListener('mousemove', onMove, false);
    };
    root.addEventListener('mousemove', onMove, {
      passive: true
    });
    root.addEventListener('mouseup', onCancel, {
      once: true,
      passive: true
    });
  }, []);
  const elementsRef = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});
  useEffect(() => {
    if (!activeElementId) return;
    elementsRef.current?.[activeElementId]?.focus();
  }, [activeElementId]);
  const paperRef = useRef<HTMLDivElement | null>(null);
  return <div className={styles.scrollContainer}>
      <div className={styles.wrap} onMouseDown={handleMoveCanvas} style={canvasStyle}>
        <div onClick={e => {
        if (e.currentTarget === e.target) {
          updateActiveElementId(null);
          paperRef.current?.focus({
            preventScroll: true
          });
          e.preventDefault();
        }
      }} tabIndex={99} className={styles.paper} style={{
        width: `${width}mm`,
        height: `${height}mm`,
        ...style
      }} onKeyDown={handleKeyDown} ref={paperRef}>
          {elementList.map((el, i) => <div onFocus={() => updateActiveElementId(el.id)} tabIndex={100 + i} key={el.id} ref={e => {
          elementsRef.current[el.id] = e;
        }} style={makeElementStyle(el)} className={styles.elementItem}>
              {elementRender(el)}
              <ElementCover onMouseDown={e => {
            handleMouseDown(e, el);
          }} />
            </div>)}
          {draging ? <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 2
        }} /> : null}
        </div>
      </div>
    </div>;
}
const ElementCover = memo(({
  onMouseDown
}: {
  onMouseDown: (MouseEvent) => void;
}) => {
  return <div className={styles.elementCover} onMouseDown={onMouseDown} />;
});
const makeElementStyle = (el: TemplateElement) => {
  const {
    left,
    right,
    top,
    bottom,
    width,
    height
  } = el;
  const style: React.CSSProperties = {
    ...(el.containerStyle || {})
  };
  if ((isNil(left) || isNil(right)) && !isNil(width)) style.width = `${width}pt`;
  if ((isNil(top) || isNil(bottom)) && !isNil(height)) style.height = `${height}pt`;
  ['left', 'right', 'top', 'bottom'].forEach(attr => {
    if (!isNil(el[attr])) style[attr] = `${el[attr]}pt`;
  });
  return style;
};
