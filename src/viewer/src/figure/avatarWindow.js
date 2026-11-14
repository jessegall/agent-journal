import {computed, onUnmounted, ref} from "vue";

const windows = ref(0);

// whether an avatar window is on the page: the figure lives in it then, and the chat draws none
export const avatarWindowOpen = computed(() => windows.value > 0);

// called in the setup of an avatar window: it counts while it is mounted
export function holdAvatarWindow() {
    windows.value += 1;
    onUnmounted(() => {
        windows.value -= 1;
    });
}
