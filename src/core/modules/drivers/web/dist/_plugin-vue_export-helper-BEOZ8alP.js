import { wordLabel as s } from "@journal/window-kit";
const a = { info: "Notice", steering: "Instruction", refusal: "Refusal" }, i = {
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
}, l = (e) => a[e] ?? s(e), p = (e) => i[e] ?? s(e), c = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, r] of t)
    o[n] = r;
  return o;
};
export {
  c as _,
  p as h,
  l as n
};
