import {transport} from "./transport.js";

const FIGURE_FOLDER = "/viewer/voices/figures/";

export const api = {
    voiceFigures: () => transport.request("GET", `${FIGURE_FOLDER}figures.json`),
    voiceFigureUrl: (file) => `${FIGURE_FOLDER}${file}`,
    figureDecoderUrl: () => `${FIGURE_FOLDER}draco/`,
};
