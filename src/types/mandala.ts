export interface MandalaSettings {
  symmetry: number;
  brushSize: number;
  brushColor: string;
  backgroundColor: string;
}

export interface MandalaControlsProps {
  settings: MandalaSettings;
  onSettingsChange: (settings: Partial<MandalaSettings>) => void;
  onClear: () => void;
  onDownload: () => void;
} 