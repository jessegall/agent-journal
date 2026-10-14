import {api} from "../api/client.js";
import {boardBody} from "./presets.js";

export const documentStem = (file) => file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

async function buildFromDocument(file, name, steer) {
    const made = await api.create("board", {title: name || documentStem(file), stages: []});
    await api.upload("board", made.n, file);
    await api.buildBoard(made.n, name, steer);
    return made;
}

export const makeBoard = ({preset, file, name, steer}) =>
    file ? buildFromDocument(file, name, steer.trim()) : api.create("board", boardBody(preset, name || preset.suggest));
