import type { Ref } from "vue";
import { nextTick, watch } from "vue";

/**
 * Sizes the composer's text area: three rows at rest, growing to the text plus one row, at most sixteen
 * rows, then it scrolls.
 */
const restingRows = 3;
const mostRows = 16;

export function useComposerHeight(
  textarea: Ref<HTMLTextAreaElement | null>,
  text: Ref<string>,
): void {
  async function fit(): Promise<void> {
    await nextTick();
    const element = textarea.value;

    if (element === null) {
      return;
    }

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    element.style.height = "auto";
    const textRows = Math.ceil(element.scrollHeight / lineHeight);
    const rows = Math.min(Math.max(textRows + 1, restingRows), mostRows);
    element.style.height = `${rows * lineHeight}px`;
  }

  watch(text, fit, { immediate: true });
}
