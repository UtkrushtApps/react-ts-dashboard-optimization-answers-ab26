import React, { CSSProperties, UIEvent, useCallback, useMemo, useState } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  /** Fixed height of a single row in pixels */
  itemHeight: number;
  /** Height of the scrollable container in pixels */
  height: number;
  /** Number of extra items to render above and below the viewport */
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  style?: CSSProperties;
}

/**
 * A minimal, dependency-free virtualized list implementation.
 *
 * Optimizations:
 * - Renders only the items that are visible in the viewport (+ overscan).
 * - Keeps a constant number of DOM nodes regardless of input size.
 */
export function VirtualizedList<T>(props: VirtualizedListProps<T>): JSX.Element {
  const { items, itemHeight, height, overscan = 5, renderItem, style } = props;

  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setScrollTop(target.scrollTop);
  }, []);

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (items.length === 0) {
      return { startIndex: 0, endIndex: 0, offsetY: 0 };
    }

    const rawStart = Math.floor(scrollTop / itemHeight) - overscan;
    const start = Math.max(0, rawStart);
    const viewportItemCount = Math.ceil(height / itemHeight) + overscan * 2;
    const end = Math.min(items.length, start + viewportItemCount);
    const offset = start * itemHeight;

    return { startIndex: start, endIndex: end, offsetY: offset };
  }, [height, itemHeight, items.length, overscan, scrollTop]);

  const visibleItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  return (
    <div
      style={{
        overflowY: 'auto',
        position: 'relative',
        height,
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div style={{ position: 'relative', height: totalHeight }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
}
