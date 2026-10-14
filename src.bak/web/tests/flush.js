import {nextTick} from "vue";

export const flush = async () => {
    for (let i = 0; i < 5; i++) await nextTick();
};
