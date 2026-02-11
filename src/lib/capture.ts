/**
 * Shared html2canvas screenshot utility for save & share.
 */
export async function captureCard(elementId = "fortune-card"): Promise<Blob> {
  const html2canvas = (await import("html2canvas-pro")).default;
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Element not found");
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}
