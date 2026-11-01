import {nextTick} from "vue";

// waits for the rounds of rendering a mounted component needs to show what it was given
export async function settled() {
    for (let round = 0; round < 5; round++) await nextTick();
    for (let turn = 0; turn < 3; turn++) await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
}

// waits for the rounds of timers a mounted component needs besides its renders
export async function settledByTimer() {
    for (let round = 0; round < 5; round++) {
        await new Promise((resolve) => setTimeout(resolve));
        await nextTick();
    }
}
