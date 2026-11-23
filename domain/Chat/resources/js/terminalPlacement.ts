/**
 * The narrowest the chat and the terminal may get beside each other, in rem, and the splitter's width in pixels.
 */
export const CHAT_MINIMUM_REM = 20;
export const TERMINAL_MINIMUM_REM = 32;
export const DIVIDER_PIXELS = 7;

/**
 * Where the chat keeps the share of the width it gives itself beside the terminal.
 */
export const SPLIT_STORAGE_KEY = "chat.terminal.split";

export const DEFAULT_CHAT_SHARE = 0.4;

/**
 * How the chat and the terminal share the window: side by side, as two named tabs, or the terminal filling it.
 */
export type TerminalPlacement = "dock" | "tabs" | "full-screen";

/**
 * Side by side when the width fits both minimums and the divider, otherwise tabs.
 */
export function placementFor(
  widthPixels: number,
  remPixels: number,
): "dock" | "tabs" {
  const needed =
    (CHAT_MINIMUM_REM + TERMINAL_MINIMUM_REM) * remPixels + DIVIDER_PIXELS;

  return widthPixels >= needed ? "dock" : "tabs";
}

/**
 * The chat's share of the width, kept between what leaves each pane its minimum.
 */
export function boundedChatShare(
  share: number,
  widthPixels: number,
  remPixels: number,
): number {
  if (widthPixels <= 0) {
    return share;
  }

  const lowest = (CHAT_MINIMUM_REM * remPixels) / widthPixels;
  const highest =
    1 - (TERMINAL_MINIMUM_REM * remPixels + DIVIDER_PIXELS) / widthPixels;

  return Math.min(Math.max(share, lowest), Math.max(lowest, highest));
}

/**
 * A stored share as the chat reads it back, or none when what is stored is not a share.
 */
export function storedShare(decoded: unknown): number | null {
  return typeof decoded === "number" && decoded > 0 && decoded < 1
    ? decoded
    : null;
}
