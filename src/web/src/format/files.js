const PICTURE = /\.(png|jpe?g|gif|webp)$/i;

export const isPicture = (name) => PICTURE.test(name);
