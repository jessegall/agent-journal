import {nextTick} from "vue";

// waits for the rounds of rendering a mounted component needs to show what it was given
export async function settled() {
    for (let round = 0; round < 5; round++) await nextTick();
}
