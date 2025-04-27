'use client';

import { useEffect, useRef, useState } from 'react';
import { MandalaSettings } from '@/types/mandala';
import MandalaControls from './MandalaControls';
import MintMandala from './MintMandala';
import dynamic from 'next/dynamic';

const defaultSettings: MandalaSettings = {
  symmetry: 8,
  brushSize: 5,
  brushColor: '#000000',
  backgroundColor: '#ffffff',
};

// Dynamically import p5 to avoid SSR issues
const P5CanvasInner = dynamic(
  () => import('@/components/P5CanvasInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square border border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading canvas...</p>
      </div>
    ),
  }
);

const P5Canvas = () => {
  const [settings, setSettings] = useState<MandalaSettings>(defaultSettings);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSettingsChange = (newSettings: Partial<MandalaSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto px-4">
      <div 
        ref={canvasRef} 
        className="border border-gray-300 rounded-lg w-full aspect-square touch-none"
        style={{ touchAction: 'none' }}
      >
        <P5CanvasInner canvasRef={canvasRef} settings={settings} />
      </div>
      <MandalaControls
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onClear={() => {}}
        onDownload={() => {}}
      />
      <MintMandala canvasRef={canvasRef} settings={settings} />
    </div>
  );
};

export default P5Canvas; 