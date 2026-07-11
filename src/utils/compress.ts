import { PortfolioData } from "../types";

/**
 * Compresses a Base64 image string if it exceeds a certain threshold.
 * Uses an HTML5 canvas to downscale and compress as JPEG.
 */
export function compressBase64Image(
  base64Str: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  // If not a base64 image or already very small, return as-is
  if (!base64Str || !base64Str.startsWith("data:image/")) {
    return Promise.resolve(base64Str);
  }

  // If the base64 string is already under ~150KB, skip compression to avoid CPU overhead
  if (base64Str.length < 200000) {
    return Promise.resolve(base64Str);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale proportionally
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Force output to JPEG format with a specified compression quality
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Iterates through all image fields in PortfolioData and compresses them if they are base64 strings.
 */
export async function compressPortfolioDataImages(data: PortfolioData): Promise<PortfolioData> {
  // Deep clone to prevent direct state mutation
  const clone = JSON.parse(JSON.stringify(data)) as PortfolioData;

  if (clone.general) {
    if (clone.general.logoImage) {
      clone.general.logoImage = await compressBase64Image(clone.general.logoImage);
    }
    if (clone.general.profileImage) {
      clone.general.profileImage = await compressBase64Image(clone.general.profileImage);
    }
  }

  if (clone.gallery && Array.isArray(clone.gallery)) {
    for (let i = 0; i < clone.gallery.length; i++) {
      if (clone.gallery[i].imageUrl) {
        clone.gallery[i].imageUrl = await compressBase64Image(clone.gallery[i].imageUrl);
      }
    }
  }

  if (clone.education && Array.isArray(clone.education)) {
    for (let i = 0; i < clone.education.length; i++) {
      if (clone.education[i].imageUrl) {
        clone.education[i].imageUrl = await compressBase64Image(clone.education[i].imageUrl);
      }
    }
  }

  return clone;
}

/**
 * Reads a File object and compresses it as a JPEG base64 string.
 */
export function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      compressBase64Image(base64, maxWidth, maxHeight, quality)
        .then(resolve)
        .catch(reject);
    };
    reader.onerror = (err) => reject(err);
  });
}
