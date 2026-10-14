import {ref} from "vue";
import {onBlocked} from "../api/client.js";

export const blocked = ref(null);

onBlocked((why) => (blocked.value = {text: `You can't do that. ${why}`}));
