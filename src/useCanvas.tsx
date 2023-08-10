import * as React from 'react';

function useCanvas(): CanvasRenderingContext2D {
  const ref = React.useRef<CanvasRenderingContext2D | null>(null);

  if (ref.current) return ref.current;

  const canvas = document.createElement('canvas');
  ref.current = canvas.getContext('2d');
  return ref.current as CanvasRenderingContext2D;
}

export default useCanvas;
