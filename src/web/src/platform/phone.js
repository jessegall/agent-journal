// Whether this page is the phone app: the viewer itself, served under /p/ through the tunnel, which speaks to the
// journal through /p as the paired phone and has no live stream to listen on. Outside a page, as in a test, it is not.
export const onPhone = typeof document !== "undefined" && document.documentElement.classList.contains("phone");
