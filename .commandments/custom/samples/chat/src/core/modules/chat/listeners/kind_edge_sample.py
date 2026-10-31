def folded(entries) -> list:
    # @sin architecture_chat_NoModuleKindPathDetector
    return [entry for entry in entries if entry.shipped]


def declared(entries) -> list:
    # @righteous architecture_chat_NoModuleKindPathDetector
    return [entry for entry in entries if entry.type]
