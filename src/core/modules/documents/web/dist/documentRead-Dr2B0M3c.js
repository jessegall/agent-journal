const t = /* @__PURE__ */ new Set(["doc comment", "report comment", "doc close", "doc edit", "report edit"]), c = (e) => (o) => t.has(o.slice(0, 2).join(" ")) ? e.run(o) : e.read(o);
export {
  c as d
};
