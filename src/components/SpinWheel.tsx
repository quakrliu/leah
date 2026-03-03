"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { prizes } from "@/config/prizes";

interface SpinWheelProps {
  onSpinEnd: (prizeIndex: number) => void;
  targetPrizeIndex: number | null; // pre-determined prize index
  spinning: boolean;
}

const SEGMENT_COUNT = prizes.length;
const SEGMENT_ANGLE = (2 * Math.PI) / SEGMENT_COUNT;

export default function SpinWheel({ onSpinEnd, targetPrizeIndex, spinning }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animatingRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState(340);

  // Responsive canvas sizing
  useEffect(() => {
    function updateSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = Math.min(vw - 40, vh * 0.5, 400);
      setCanvasSize(Math.max(280, size));
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const displaySize = canvasSize;
      canvas.width = displaySize * dpr;
      canvas.height = displaySize * dpr;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
      ctx.scale(dpr, dpr);

      const cx = displaySize / 2;
      const cy = displaySize / 2;
      const radius = displaySize / 2 - 8;

      ctx.clearRect(0, 0, displaySize, displaySize);

      // Draw segments
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        const startAngle = rotation + i * SEGMENT_ANGLE;
        const endAngle = startAngle + SEGMENT_ANGLE;

        // Fill segment
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prizes[i].color;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + SEGMENT_ANGLE / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#333";
        ctx.font = `bold ${Math.max(11, displaySize / 28)}px "Noto Sans TC", sans-serif`;

        const emoji = prizes[i].emoji;
        const name = prizes[i].name;

        // Emoji closer to edge
        ctx.fillText(emoji, radius * 0.72, 4);
        // Name a bit closer to center
        ctx.font = `bold ${Math.max(9, displaySize / 34)}px "Noto Sans TC", sans-serif`;
        // Split long names
        if (name.length > 6) {
          ctx.fillText(name.slice(0, 6), radius * 0.5, 3);
          ctx.fillText(name.slice(6), radius * 0.5, 3 + Math.max(12, displaySize / 26));
        } else {
          ctx.fillText(name, radius * 0.5, 4);
        }
        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#4A7C59";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center text
      ctx.fillStyle = "#4A7C59";
      ctx.font = `bold ${Math.max(12, displaySize / 22)}px "Noto Sans TC", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("LEAH", cx, cy);

      // Pointer (triangle at top)
      const pointerSize = displaySize / 18;
      ctx.beginPath();
      ctx.moveTo(cx, 2);
      ctx.lineTo(cx - pointerSize, 0);
      ctx.lineTo(cx + pointerSize, 0);
      ctx.closePath();
      ctx.fillStyle = "#FF4444";
      ctx.fill();

      // Pointer stem
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, pointerSize + 6);
      ctx.strokeStyle = "#FF4444";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pointer dot
      ctx.beginPath();
      ctx.arc(cx, pointerSize + 6, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF4444";
      ctx.fill();
    },
    [canvasSize]
  );

  // Initial draw
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  // Spin animation
  useEffect(() => {
    if (!spinning || targetPrizeIndex === null || animatingRef.current) return;
    const targetIdx = targetPrizeIndex;
    animatingRef.current = true;

    // Calculate target rotation:
    // Pointer is at top (angle = -PI/2 or 3PI/2)
    // We need the target segment's center to align with the top
    // Segment i center is at: i * SEGMENT_ANGLE + SEGMENT_ANGLE/2
    // We want: rotation + targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE/2 = -PI/2 (mod 2PI)
    // rotation = -PI/2 - targetIndex * SEGMENT_ANGLE - SEGMENT_ANGLE/2

    const targetAngle =
      -Math.PI / 2 - targetIdx * SEGMENT_ANGLE - SEGMENT_ANGLE / 2;

    // Add extra full rotations for visual effect (5-8 full spins)
    const extraSpins = (5 + Math.random() * 3) * 2 * Math.PI;
    const totalRotation = targetAngle - rotationRef.current - extraSpins;

    const startRotation = rotationRef.current;
    const duration = 4000 + Math.random() * 1500; // 4-5.5 seconds
    const startTime = performance.now();

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      rotationRef.current = startRotation + totalRotation * eased;
      drawWheel(rotationRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animatingRef.current = false;
        onSpinEnd(targetIdx);
      }
    }

    requestAnimationFrame(animate);
  }, [spinning, targetPrizeIndex, drawWheel, onSpinEnd]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="drop-shadow-xl"
        style={{ width: canvasSize, height: canvasSize }}
      />
    </div>
  );
}
