import React, { useRef, useEffect, useState } from 'react';

type Block = {
  index: number;
  data: string;
  previous_hash: string;
  hash: string;
  nonce: number;
};

type BlockCanvasProps = {
  blocks: Block[];
};

const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocks }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; block: Block | null }>({
    visible: false,
    x: 0,
    y: 0,
    block: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definições de layout
    const blockWidth = 150;
    const blockHeight = 50;
    const blockGap = 50;
    const startX = 20;
    const startY = 100;

    // Mapeia o índice para as coordenadas de cada bloco
    const coordinates: Record<number, { x: number; y: number }> = {};

    // Desenha os blocos horizontalmente
    blocks.forEach((block, index) => {
      const x = startX + index * (blockWidth + blockGap);
      const y = startY;

      coordinates[block.index] = { x, y };

      // Desenha o retângulo do bloco
      ctx.fillStyle = '#61dafb';
      ctx.fillRect(x, y, blockWidth, blockHeight);

      // Desenha o texto do bloco
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(block.data, x + 10, y + 30);
    });

    // Desenha as setas indicando a sequência dos blocos
    ctx.strokeStyle = '#ff4500'; // Cor das setas
    ctx.lineWidth = 2;

    blocks.forEach((block, index) => {
      if (index > 0) {
        const previousBlock = blocks[index - 1];
        const start = coordinates[previousBlock.index];
        const end = coordinates[block.index];

        // Desenha a linha da seta
        ctx.beginPath();
        ctx.moveTo(start.x + blockWidth, start.y + blockHeight / 2);
        ctx.lineTo(end.x, end.y + blockHeight / 2);
        ctx.stroke();

        // Desenha a cabeça da seta
        const arrowSize = 10;
        const angle = Math.atan2(0, end.x - start.x); // Setas em linha horizontal
        ctx.beginPath();
        ctx.moveTo(end.x, end.y + blockHeight / 2);
        ctx.lineTo(end.x - arrowSize * Math.cos(angle - Math.PI / 6), end.y + blockHeight / 2 - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x - arrowSize * Math.cos(angle + Math.PI / 6), end.y + blockHeight / 2 - Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = '#ff4500';
        ctx.fill();
      }
    });

    // Adiciona o evento de mouse move para mostrar tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let hoveredBlock: Block | null = null;

      blocks.forEach((block) => {
        const { x, y } = coordinates[block.index];
        if (mouseX >= x && mouseX <= x + blockWidth && mouseY >= y && mouseY <= y + blockHeight) {
          hoveredBlock = block;
        }
      });

      if (hoveredBlock) {
        setTooltip({ visible: true, x: mouseX, y: mouseY, block: hoveredBlock });
      } else {
        setTooltip({ visible: false, x: 0, y: 0, block: null });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [blocks]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={1200} height={300} />

      {tooltip.visible && tooltip.block && (
        <div
          style={{
            position: 'absolute',
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div><strong>Data:</strong> {tooltip.block.data}</div>
          <div><strong>Index:</strong> {tooltip.block.index}</div>
          <div><strong>Hash:</strong> {tooltip.block.hash}</div>
          <div><strong>Previous Hash:</strong> {tooltip.block.previous_hash}</div>
          <div><strong>Nonce:</strong> {tooltip.block.nonce}</div>
        </div>
      )}
    </div>
  );
};

export default BlockCanvas;
