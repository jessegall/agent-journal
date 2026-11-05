export const onMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform);
export const MOD = onMac ? "⌘" : "Ctrl";

export function submitOnEnter(event, submit) {
    if (event.shiftKey || event.isComposing) return;
    event.preventDefault();
    submit();
}
