const BANNER_FOR = 3200;
const TEXT = "This is a replay, so the message is already written: press Send to send it.";

export function noticeOwnWords() {
    let banner = null;
    let gone = null;
    const cleared = () => {
        if (banner) banner.remove();
        banner = null;
    };
    window.addEventListener("replay-hint", () => {
        if (banner) banner.remove();
        clearTimeout(gone);
        banner = document.createElement("div");
        banner.textContent = TEXT;
        banner.setAttribute("role", "status");
        Object.assign(banner.style, {
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
        document.body.append(banner);
        gone = setTimeout(cleared, BANNER_FOR);
    });
}
