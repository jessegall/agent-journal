import {copyText} from "../platform/clipboard.js";
import "./codeBlock.css";

const FLASH = 1500;
const timers = new WeakMap();

async function copyBlock(event) {
    const button = event.target instanceof Element ? event.target.closest(".chat-code-copy") : null;
    if (!button) return;
    event.stopPropagation();
    if (!(await copyText(button.nextElementSibling?.textContent || ""))) return;
    button.textContent = "Copied";
    button.classList.add("copied");
    clearTimeout(timers.get(button));
    timers.set(
        button,
        setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
        }, FLASH)
    );
}

if (typeof document !== "undefined") document.addEventListener("click", copyBlock, true);
