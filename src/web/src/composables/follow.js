import {onUnmounted, ref, unref} from "vue";

const NEAR_BOTTOM = 8;
const GLIDE_MS = 700;
const GLIDE_STEP = 0.14;

export function useFollow(scroller) {
    const following = ref(true);
    const unseen = ref(0);
    let frame = 0;
    let gliding = false;
    let until = 0;

    function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        gliding = false;
    }

    function step() {
        const box = unref(scroller);
        if (!box || !following.value) return stop();
        const target = box.scrollHeight - box.clientHeight;
        const distance = target - box.scrollTop;
        if (Math.abs(distance) > 1) box.scrollTop += Math.sign(distance) * Math.max(1, Math.round(Math.abs(distance) * GLIDE_STEP));
        else box.scrollTop = target;
        if (Math.abs(distance) <= 1 && performance.now() > until) return stop();
        frame = requestAnimationFrame(step);
    }

    function glide() {
        until = performance.now() + GLIDE_MS;
        gliding = true;
        if (!frame) frame = requestAnimationFrame(step);
    }

    function follow(on) {
        following.value = on;
        if (on) unseen.value = 0;
    }

    function snap() {
        const box = unref(scroller);
        if (box && following.value) box.scrollTop = box.scrollHeight;
    }

    function landed(count) {
        if (following.value) glide();
        else unseen.value += count;
    }

    function jump() {
        follow(true);
        glide();
    }

    function scrolled(event) {
        const box = event.currentTarget;
        const near = box.scrollHeight - box.scrollTop - box.clientHeight < NEAR_BOTTOM;
        if (near && !following.value) follow(true);
        if (!near && !gliding && following.value) follow(false);
    }

    function wheeled(event) {
        const box = event.currentTarget;
        if (event.deltaY >= 0 || !following.value || box.scrollHeight <= box.clientHeight + NEAR_BOTTOM) return;
        stop();
        follow(false);
    }

    onUnmounted(stop);

    return {following, unseen, snap, landed, jump, scrolled, wheeled};
}
