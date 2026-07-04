export const base64ToImageSrc = (base64) => {
  if (!base64) return "";

  return `data:image/png;base64,${base64}`;
};
