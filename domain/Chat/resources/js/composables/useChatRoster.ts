import { reactive } from "vue";

/**
 * Whether the chat's members are shown to add someone, opened by the roster's own button or the conversation menu.
 */
export const chatRoster = reactive({ isOpen: false });
