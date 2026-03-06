import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal } from './Modal';
import { getCroppedImg } from '../../utils/imageCrop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Chỉnh sửa ảnh ✂️">
      <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden mb-4">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thu phóng</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
          >
            Lưu ảnh
          </button>
        </div>
      </div>
    </Modal>
  );
}
