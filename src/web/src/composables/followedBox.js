import {onUnmounted} from "vue";

const FOLLOW = 250;

export function useFollowedBox(measure) {
    let following = 0;
    const stop = () => clearInterval(following);
    const follow = () => {
        stop();
        following = setInterval(measure, FOLLOW);
    };
    onUnmounted(stop);
    return {follow, stop};
}
