def mark_text(entry) -> str:
    # @sin architecture_chat_module_kind_path
    if entry.shipped:
        return entry.label
    # @righteous architecture_chat_module_kind_path
    return entry.label.strip()
