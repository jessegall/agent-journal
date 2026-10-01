const SHOWN_FOR = 3200;
const SAID = "This is a replay, so your own messages are not sent: the chat sends only the recorded ones.";

export function hintOnTyping() {
    let shown = null;
    window.addEventListener("replay-hint", () => {
        if (shown) return;
        shown = document.createElement("div");
        shown.textContent = SAID;
        shown.setAttribute("role", "status");
        Object.assign(shown.style, {
            position: "fixed",
            left: "50%",
            bottom: "96px",
            transform: "translateX(-50%)",
            zIndex: "100",
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
        setTimeout(() => {
            shown.remove();
            shown = null;
        }, SHOWN_FOR);
    });
}
