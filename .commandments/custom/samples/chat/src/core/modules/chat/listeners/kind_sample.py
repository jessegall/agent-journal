def mark_text(entry) -> str:
    # @sin architecture_chat_NoModuleKindPathDetector
    if entry.shipped:
        return entry.label
    # @righteous architecture_chat_NoModuleKindPathDetector
    return entry.label.strip()
