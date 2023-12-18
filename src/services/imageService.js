export const convertToJpg = (file) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          resolve(blob); // Resolve with the resulting blob
        },
        "image/jpeg",
        1,
      ); // convert to jpeg format
    };
    img.onerror = reject;
  });
};
