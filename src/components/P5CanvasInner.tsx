'use client';

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { MandalaSettings } from '@/types/mandala';

interface P5CanvasInnerProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  settings: MandalaSettings;
}

const P5CanvasInner = ({ canvasRef, settings }: P5CanvasInnerProps) => {
  const sketchRef = useRef<any>(null);
  const settingsRef = useRef<MandalaSettings>(settings);
  const p5InstanceRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Keep settingsRef in sync with settings
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: any) => {
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      p.setup = () => {
        // Create a responsive canvas
        const canvas = p.createCanvas(
          Math.min(window.innerWidth - 32, 600),
          Math.min(window.innerWidth - 32, 600)
        );
        p.background(settingsRef.current.backgroundColor);
        canvas.parent(canvasRef.current);
        
        // Enable touch events
        canvas.elt.addEventListener('touchstart', (e: any) => {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvas.elt.getBoundingClientRect();
          lastX = touch.clientX - rect.left;
          lastY = touch.clientY - rect.top;
          isDrawing = true;
        });

        canvas.elt.addEventListener('touchmove', (e: any) => {
          e.preventDefault();
          if (isDrawing) {
            const touch = e.touches[0];
            const rect = canvas.elt.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // Get current settings from ref
            const currentSettings = settingsRef.current;
            
            // Update brush settings before drawing
            p.stroke(currentSettings.brushColor);
            p.strokeWeight(currentSettings.brushSize);
            p.noFill();

            // Draw the original stroke
            p.line(lastX, lastY, x, y);

            // Draw the symmetrical strokes
            const centerX = p.width / 2;
            const centerY = p.height / 2;
            const angle = (2 * Math.PI) / currentSettings.symmetry;

            for (let i = 1; i < currentSettings.symmetry; i++) {
              p.push();
              p.translate(centerX, centerY);
              p.rotate(angle * i);
              p.translate(-centerX, -centerY);
              p.line(lastX, lastY, x, y);
              p.pop();
            }

            lastX = x;
            lastY = y;
          }
        });

        canvas.elt.addEventListener('touchend', (e: any) => {
          e.preventDefault();
          isDrawing = false;
        });

        // Mark as initialized after setup is complete
        setIsInitialized(true);
      };

      p.windowResized = () => {
        // Resize canvas when window size changes
        p.resizeCanvas(
          Math.min(window.innerWidth - 32, 600),
          Math.min(window.innerWidth - 32, 600)
        );
        p.background(settingsRef.current.backgroundColor);
      };

      p.draw = () => {
        if (isDrawing) {
          // Get current settings from ref
          const currentSettings = settingsRef.current;
          
          // Update brush settings before drawing
          p.stroke(currentSettings.brushColor);
          p.strokeWeight(currentSettings.brushSize);
          p.noFill();

          // Draw the original stroke
          p.line(lastX, lastY, p.mouseX, p.mouseY);

          // Draw the symmetrical strokes
          const centerX = p.width / 2;
          const centerY = p.height / 2;
          const angle = (2 * Math.PI) / currentSettings.symmetry;

          for (let i = 1; i < currentSettings.symmetry; i++) {
            p.push();
            p.translate(centerX, centerY);
            p.rotate(angle * i);
            p.translate(-centerX, -centerY);
            p.line(lastX, lastY, p.mouseX, p.mouseY);
            p.pop();
          }

          lastX = p.mouseX;
          lastY = p.mouseY;
        }
      };

      p.mousePressed = () => {
        isDrawing = true;
        lastX = p.mouseX;
        lastY = p.mouseY;
      };

      p.mouseReleased = () => {
        isDrawing = false;
      };

      // Store the sketch instance
      sketchRef.current = p;
    };

    const instance = new p5(sketch);
    p5InstanceRef.current = instance;

    return () => {
      if (instance) {
        instance.remove();
      }
      setIsInitialized(false);
    };
  }, []);

  // Update background when it changes
  useEffect(() => {
    if (isInitialized && sketchRef.current) {
      sketchRef.current.background(settings.backgroundColor);
    }
  }, [settings.backgroundColor, isInitialized]);

  return null;
};

export default P5CanvasInner; 