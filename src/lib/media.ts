/** Keep uploaded photos small enough for the site's existing browser storage. */
export async function readImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(file.type)) throw new Error("JPG, PNG yoki WebP rasm tanlang");
  if (file.size > 5 * 1024 * 1024) throw new Error("Rasm 5 MB dan katta bo‘lmasligi kerak");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Rasmni o‘qib bo‘lmadi");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.86);
  } finally { URL.revokeObjectURL(url); }
}
