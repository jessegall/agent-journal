import type { Ref } from "vue";
import { nextTick, watch } from "vue";

/**
 * Sizes the composer's text area as the design draws it: one row at rest, growing with the text to at most sixteen
 * rows, then it scrolls.
 */
const restingRows = 1;
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

    const style = getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    element.style.height = "auto";
    // An empty area measures its placeholder, which may wrap while the column is still being laid out.
    const textRows =
      text.value === ""
        ? restingRows
        : Math.round((element.scrollHeight - padding) / lineHeight);
    const rows = Math.min(Math.max(textRows, restingRows), mostRows);
    element.style.height = `${rows * lineHeight + padding}px`;
  }

  watch(text, fit, { immediate: true });
}
