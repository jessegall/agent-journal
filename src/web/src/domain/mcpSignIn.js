// The sign-in to an MCP server that the journal runs itself: the page the user approves on, and the address the browser ends on,
// pasted back when that page cannot load because the journal runs on another computer.

export const signsIn = (server) => server.auth === "oauth";

export const SIGN_IN_WORDS = {
    offer: "Signs in on the server's own page, in your browser.",
    button: "Sign in",
    open: "Open the sign-in page",
    approve: "Approve the sign-in there. When the journal runs on this computer, it finishes by itself.",
    paste: "If the page your browser ends on does not load (its address starts with http://localhost), paste that address here.",
    placeholder: "Paste the address your browser ended on",
    finish: "Finish signing in",
    again: "Start again",
};
