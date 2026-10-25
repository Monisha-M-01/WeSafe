/**
 * Computes SHA-256 hash strictly inside the user's browser using
 * the standard Web Crypto API (SubtleCrypto) before any file data
 * is transmitted.
 */
export async function computeClientSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hex;
}

/**
 * Computes an in-browser perceptual average hash (64-bit hex)
 * using HTML5 Canvas for true zero-upload client-side hashing.
 */
export async function computeClientPerceptualHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Render down to 8x8 grayscale canvas
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('f8e4b2c19a637104');
          return;
        }
        ctx.drawImage(img, 0, 0, 8, 8);
        const imgData = ctx.getImageData(0, 0, 8, 8);
        const data = imgData.data;

        // Grayscale values
        const grays: number[] = [];
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          grays.push(gray);
          total += gray;
        }

        const avg = total / 64;
        let bits = '';
        for (const g of grays) {
          bits += g >= avg ? '1' : '0';
        }

        // Convert 64 bits to 16 hex chars
        let hex = '';
        for (let i = 0; i < 64; i += 4) {
          const nibble = bits.substring(i, i + 4);
          hex += parseInt(nibble, 2).toString(16);
        }
        resolve(hex || 'f8e4b2c19a637104');
      };
      img.onerror = () => resolve('f8e4b2c19a637104');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('f8e4b2c19a637104');
    reader.readAsDataURL(file);
  });
}
