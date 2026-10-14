export const onMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform);
export const MOD = onMac ? "⌘" : "Ctrl";
