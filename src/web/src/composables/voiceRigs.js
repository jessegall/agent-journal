import {ref} from "vue";
import {api} from "../api/client.js";
import {rigUrl} from "../domain/rig.js";

// Settles once every one of the pictures is in the browser, loaded or failed, so nothing drawn from them pops in late.
export const loadPictures = (urls) =>
    Promise.all(
        urls.map(
            (url) =>
                new Promise((resolve) => {
                    const picture = new Image();
                    picture.onload = () => resolve(url);
                    picture.onerror = () => resolve(url);
                    picture.src = url;
                })
        )
    );

// Every image a rig draws: each layer's file and all of its states.
export const picturesOf = (rig) => [...new Set(rig.layers.flatMap((layer) => [layer.file, ...Object.values(layer.states || {})]))];

// Each voice's cut-out rig and its keyframed moves, by voice name, loaded once.
export const rigs = ref({});

export const voiceOfArt = (art) =>
    (art || "")
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, "");

export async function loadRig(voice) {
    if (!voice || rigs.value[voice]) return rigs.value[voice];
    try {
        const [rig, moves] = await Promise.all([api.voiceRig(voice), api.voiceMoves(voice)]);
        await loadPictures(picturesOf(rig).map((file) => api.publicUrl(rigUrl(voice, file))));
        rigs.value = {...rigs.value, [voice]: {rig, moves: moves.moves, blink: moves.blink || null}};
    } catch {
        rigs.value = {...rigs.value, [voice]: null};
    }
    return rigs.value[voice];
}
