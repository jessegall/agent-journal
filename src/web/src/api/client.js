// The figure assets ship with the viewer, so they are read beside the page.
export const api = {
    voiceFigures: () => fetch("./voices/figures/figures.json").then((r) => r.json()),
    voiceFigureUrl: (file) => new URL(`./voices/figures/${file}`, window.location.href).href,
    figureDecoderUrl: () => new URL("./voices/figures/draco/", window.location.href).href,
};
