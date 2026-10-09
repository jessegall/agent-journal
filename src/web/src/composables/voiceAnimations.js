import {ref} from "vue";
import {api} from "../api/client.js";

// Every voice's animations by profile number, found by file name on the server: the sheets it ships with and the ones dropped on it.
export const animations = ref({});

export async function loadAnimations() {
    animations.value = await api.profileAnimations();
}

export const urlOf = (n, animation) => (animation.shipped ? api.publicUrl(`voices/${animation.path}`) : api.fileUrl("profile", n, animation.file));

export const ofKind = (n, kind) => (animations.value[n] || []).filter((animation) => animation.kind === kind);

export async function dropAnimations(row, files) {
    for (const file of files) await api.upload("profile", row.n, file);
    await loadAnimations();
}
