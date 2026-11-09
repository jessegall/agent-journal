import { wordLabel as s } from "@journal/window-kit";
const l = { info: "Notice", steering: "Instruction", refusal: "Refusal" }, a = {
  pre_tool_use: "Before a tool runs",
  post_tool_use: "After a tool runs",
  post_tool_use_failure: "Tool failed",
  prompt: "Prompt submitted",
  stop: "Agent stopping",
  stop_failure: "Agent failed",
  session_start: "Session started",
  session_end: "Session ended",
  compact: "Context shortened",
  message_display: "Message shown",
  tick: "Timer"
}, i = { allowed: "Allowed", refused: "Refused", rewritten: "Rewrote input", lines: "Added lines", raised: "Failed", disabled: "Switched off", silenced: "Skipped" }, c = (e) => s(e.replace(".", ": ").replaceAll("-", " ")), p = (e) => i[e] ?? s(e), _ = (e) => l[e] ?? s(e), u = (e) => a[e] ?? s(e), f = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, r] of o)
    t[n] = r;
  return t;
};
export {
  f as _,
  p as c,
  u as h,
  _ as n,
  c as r
};
