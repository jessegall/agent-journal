const PICTURE = /\.(png|jpe?g|gif|webp|svg)$/i;

export const isPicture = (name) => PICTURE.test(name);

