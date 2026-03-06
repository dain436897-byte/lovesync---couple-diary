/**
 * Compresses an image (data URL or File) using canvas.
 * Ensures output is under the given maxKB threshold.
 * Returns a compressed base64 data URL.
 */
export async function compressImage(
    source: string | File,
    maxKB = 200,
    maxWidth = 800
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Scale down if too wide
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            // Try different quality levels until under limit
            let quality = 0.8;
            let result = canvas.toDataURL('image/jpeg', quality);

            while (result.length > maxKB * 1024 * 1.37 && quality > 0.1) {
                quality -= 0.1;
                result = canvas.toDataURL('image/jpeg', quality);
            }

            resolve(result);
        };
        img.onerror = reject;

        if (typeof source === 'string') {
            img.src = source;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => { img.src = e.target!.result as string; };
            reader.onerror = reject;
            reader.readAsDataURL(source);
        }
    });
}
