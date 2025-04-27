'use client';

import { MandalaControlsProps } from '@/types/mandala';

const MandalaControls = ({
  settings,
  onSettingsChange,
  onClear,
  onDownload,
}: MandalaControlsProps) => {
  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Symmetry: {settings.symmetry}
          </label>
          <input
            type="range"
            min="4"
            max="24"
            value={settings.symmetry}
            onChange={(e) =>
              onSettingsChange({ symmetry: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brush Size: {settings.brushSize}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={settings.brushSize}
            onChange={(e) =>
              onSettingsChange({ brushSize: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brush Color
          </label>
          <input
            type="color"
            value={settings.brushColor}
            onChange={(e) =>
              onSettingsChange({ brushColor: e.target.value })
            }
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) =>
              onSettingsChange({ backgroundColor: e.target.value })
            }
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Clear Canvas
          </button>
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MandalaControls; 