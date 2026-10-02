const SHOWN_FOR = 3200;
const SAID = "This is a replay, so your own words are not sent: press Send to send the recorded message.";

export function noticeOwnWords() {
    let shown = null;
    let gone = null;
    const cleared = () => {
        if (shown) shown.remove();
        shown = null;
    };
    window.addEventListener("replay-hint", () => {
        if (shown) shown.remove();
        clearTimeout(gone);
        shown = document.createElement("div");
        shown.textContent = SAID;
        shown.setAttribute("role", "status");
        Object.assign(shown.style, {
            position: "fixed",
            left: "50%",
            top: "88px",
            transform: "translateX(-50%)",
            zIndex: "10000",
            maxWidth: "min(360px, calc(100vw - 32px))",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "var(--accent)",
            color: "#fff",
            font: "13px/1.4 var(--font, system-ui)",
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        });
        document.body.append(shown);
        gone = setTimeout(cleared, SHOWN_FOR);
    });
}
