import { watch } from "vue";
import { appliedReadGeneration, markDirty } from "@/composables/usePageChanges";

const FOLLOW_PAUSE_MS = 2000;

/**
 * Follows an operation through the page's own reads: it asks for one read, and once a read begun after that answered
 * and the operation is not over, it waits a moment and asks for the next. Never more than one read is out, and a
 * failed read is retried by the page's read scheduler. Stopping it, as a dialog does when it closes, ends it for
 * good, so a late read changes nothing.
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
