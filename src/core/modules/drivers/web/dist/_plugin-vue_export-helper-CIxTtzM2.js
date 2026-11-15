import { wordLabel as s } from "@journal/window-kit";
const r = { info: "Notice", steering: "Instruction", refusal: "Refusal" }, l = {
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
}, i = { allowed: "Allowed", refused: "Refused", rewritten: "Rewrote input", lines: "Added lines", raised: "Failed", disabled: "Switched off", silenced: "Skipped" }, d = (e) => s(e.replace(".", ": ").replaceAll("-", " ")), p = (e) => i[e] ?? s(e), _ = (e) => r[e] ?? s(e), f = (e) => l[e] ?? s(e), u = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, a] of o)
    t[n] = a;
  return t;
};
export {
  u as _,
  _ as a,
  p as c,
  f as h,
  d as r
};
