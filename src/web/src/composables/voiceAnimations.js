import {ref} from "vue";
import {api} from "../api/client.js";
import {DEFAULT_SCHEDULE} from "../domain/mascots.js";

// Every voice's animations by profile number, found by file name on the server: the sheets it ships with and the ones dropped on it.
export const animations = ref({});
export const schedules = ref({});

export async function loadAnimations() {
    [animations.value, schedules.value] = await Promise.all([api.profileAnimations(), api.profileSchedules()]);
}

export const urlOf = (n, animation) => (animation.shipped ? api.publicUrl(`voices/${animation.path}`) : api.fileUrl("profile", n, animation.file));

export const scheduleOf = (n) => schedules.value[n] || DEFAULT_SCHEDULE;

export async function dropAnimations(row, files) {
    for (const file of files) await api.upload("profile", row.n, file);
    await loadAnimations();
}

export async function saveEdit(row, animation, edit) {
    await api.tuneAnimation(row.n, animation.path, edit);
    await loadAnimations();
}

export async function saveSchedule(row, plan) {
    await api.scheduleVoice(row.n, plan);
    await loadAnimations();
}
