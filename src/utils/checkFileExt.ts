const imageExt = ['jpg', 'jpeg', 'png'];
const videoExt = ['webm', 'mp4'];

const checkFileExt = (file: string) => {
  const extension = file.split('.').pop() ?? '';

  if (imageExt.includes(extension)) {
    return 'image';
  }

  if (videoExt.includes(extension)) {
    return 'video';
  }
};

export default checkFileExt;
