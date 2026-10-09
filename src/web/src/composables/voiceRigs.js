import {ref} from "vue";
import {api} from "../api/client.js";

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
        rigs.value = {...rigs.value, [voice]: {rig, moves: moves.moves}};
    } catch {
        rigs.value = {...rigs.value, [voice]: null};
    }
    return rigs.value[voice];
}
