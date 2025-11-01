import React, { useState, useRef } from 'react';

const VIRTUAL_LIST_OVERSCAN = 5;

interface VirtualLogListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemHeight: number;
    containerHeight?: string;
}

function VirtualLogList<T>({ items, renderItem, itemHeight, containerHeight = '320px' }: VirtualLogListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };
    
    const containerHeightPx = containerRef.current?.clientHeight || parseInt(containerHeight, 10);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - VIRTUAL_LIST_OVERSCAN);
    const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + containerHeightPx) / itemHeight) + VIRTUAL_LIST_OVERSCAN);

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
        if(items[i]) {
            visibleItems.push(
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: `${i * itemHeight}px`,
                        left: 0,
                        right: 0,
                        height: `${itemHeight}px`,
                    }}
                >
                    {renderItem(items[i], i)}
                </div>
            );
        }
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
        >
            <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
                {visibleItems}
            </div>
        </div>
    );
}

export default VirtualLogList;
