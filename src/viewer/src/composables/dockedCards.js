import {computed, ref} from "vue";
import {usePoll} from "./poll.js";
import {useScope} from "./scope.js";

// The chat's messages with every card docked above it, the docked ones read apart from the chat's pages, so a card docked long ago
// is drawn though its message is older than the newest page.
export function useDockedCards(messages) {
    const scope = useScope();
    const docked = ref([]);
    usePoll("messages.docked", {params: () => ({session: scope.chat ? scope.chat.session : ""}), take: (got) => (docked.value = got)});
    return computed(() => {
        const read = new Set(docked.value.map((message) => message.id));
        return [...messages.value.filter((message) => !read.has(message.id)), ...docked.value];
    });
}
