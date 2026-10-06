import {ref} from "vue";

export const words = ref({helper: "helper", helpers: "helpers"});

export const helperWord = (count = 1) => (count === 1 ? words.value.helper : words.value.helpers);

export const helperCount = (count) => `${count} ${helperWord(count)}`;

export const capitalised = (word) => word.charAt(0).toUpperCase() + word.slice(1);
