/**
 * The clock time of a log line to the minute, as the chat's quiet lines show it in this browser.
 */
export function clockOf(at: string): string {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * The clock time of a log line to the second, as Technical details shows it in this browser.
 */
export function secondsClockOf(at: string): string {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
