import { nextTick, onMounted, watch, type Ref, type WatchSource } from "vue";

/** How close to the bottom, in pixels, still counts as reading the newest rows. */
const BOTTOM_MARGIN = 48;

/**
 * Keeps a chat's scroll where the reader expects it: at the bottom when the chat opens and when the reader sends;
 * at the bottom when a row arrives while the reader was there, and left alone when they scrolled up to read; and on
 * the row they were reading when earlier rows load above it.
 */
export function useChatScroll(
  log: Readonly<Ref<HTMLElement | null>>,
  rowKeys: WatchSource<string[]>,
  sentCount: WatchSource<number>,
): void {
  function toBottom(): void {
    if (log.value !== null) {
      log.value.scrollTop = log.value.scrollHeight;
    }
  }

  function isAtBottom(element: HTMLElement): boolean {
    return element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_MARGIN;
  }

  onMounted(toBottom);

  watch(sentCount, (count, previous) => {
    if (count > previous) {
      void nextTick(toBottom);
    }
  });

  watch(
    rowKeys,
    (keys, previous) => {
      const element = log.value;

      if (element === null) {
        return;
      }

      const wasAtBottom = isAtBottom(element);
      const heightBefore = element.scrollHeight;
      const loadedAbove = previous.length > 0 && keys.at(-1) === previous.at(-1) && keys[0] !== previous[0];

      void nextTick(() => {
        if (loadedAbove) {
          element.scrollTop += element.scrollHeight - heightBefore;

          return;
        }

        if (wasAtBottom) {
          toBottom();
        }
      });
    },
    { flush: "pre" },
  );
}
