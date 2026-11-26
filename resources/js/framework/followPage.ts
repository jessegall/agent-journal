import { watch } from "vue";
import { appliedReadGeneration, markDirty } from "@/composables/usePageChanges";

const FOLLOW_PAUSE_MS = 2000;

/**
 * Follows an operation through the page's own reads: once a read asked for after the operation answered and it is not
 * over, it waits a moment and asks for the next, never more than one at a time. Stopping it, as a closing dialog does,
 * ends it for good.
 */
export function followPage(isOver: () => boolean): { stop: () => void } {
  let isFollowing = true;
  let awaitedRead = markDirty("write");
  let pause: ReturnType<typeof setTimeout> | undefined;

  const stopWatching = watch(appliedReadGeneration, (applied) => {
    if (!isFollowing || applied < awaitedRead) {
      return;
    }

    if (isOver()) {
      stop();

      return;
    }

    pause = setTimeout(() => {
      if (isFollowing) {
        awaitedRead = markDirty("write");
      }
    }, FOLLOW_PAUSE_MS);
  });

  function stop(): void {
    isFollowing = false;
    clearTimeout(pause);
    stopWatching();
  }

  return { stop };
}
