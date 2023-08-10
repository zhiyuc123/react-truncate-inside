import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import useCanvas from './useCanvas';

export interface TruncateProps {
  text: string;
  /**
    width of the element
  */
  width?: number;
  /**
    the position(from the end) of the ellipsis that shows in text 
  */
  offset?: number;
  /**
    Ellipsis that is added into the text in case it is truncated
  */
  ellipsis?: string;
}

function Truncate(props: TruncateProps) {
  const { text, width = 0, offset = 8, ellipsis = '...' } = props;

  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [shouldTruncate, setShouldTruncate] = useState<boolean>(false);
  const [truncated, setTruncated] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvas();

  useEffect(() => {
    const oB = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const w = entries[0].contentRect.width;
        setTargetWidth(w);
      }
    });
    if (containerRef.current) {
      oB.observe(containerRef.current);
    }
  
    return () => {
      oB.disconnect();
    };
  }, []);
  

  useEffect(() => {
    setTruncated(false);
  }, [width, ellipsis, text, offset]);

  const setupCanvas = useCallback(() => {
    if (!containerRef.current) return;

    const style = window.getComputedStyle(containerRef.current);
    const font = [
      style['font-weight'],
      style['font-style'],
      style['font-size'],
      style['font-family'],
    ].join(' ');
    canvas.font = font;
  }, [canvas]);

  const calcTargetWidth = useCallback(() => {
    let targetW;
    if (width) {
      targetW = width;
    } else {
      targetW =  containerRef.current?.getBoundingClientRect().width;
    }
    setTargetWidth(targetW);
    const measureWidth = canvas.measureText(text).width;
    setShouldTruncate(targetW < measureWidth);
    setTruncated(true);
  }, [canvas, text, width]);

  useEffect(() => {
    setupCanvas();
    calcTargetWidth();
  }, [calcTargetWidth, setupCanvas]);

  useEffect(() => {
    if (width !== targetWidth) calcTargetWidth();
  }, [calcTargetWidth, targetWidth, width]);

  const calculatedText = useMemo(() => {
    if (!shouldTruncate) return text;
    const len = text.length;
    const tail = text.slice(len - offset, len);
    let head;

    let index = 0;
    while (index < len - offset) {
      head = text.slice(0, index);
      if (canvas.measureText(head + ellipsis + tail).width < targetWidth) {
        index += 1;
      } else {
        head = text.slice(0, index - 1 > 0 ? index - 1  : 1);
        break;
      }
    }
    return head + ellipsis + tail;
  }, [canvas, ellipsis, offset, shouldTruncate, targetWidth, text]);

  return <div ref={containerRef} style={{ width: width || '100%', whiteSpace: 'nowrap' }}>{truncated ? calculatedText : ''}</div>;
}

export default Truncate;
