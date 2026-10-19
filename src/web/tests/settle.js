import {nextTick} from "vue";

// a few ticks, so the components a test mounted have drawn what they will
export const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};
