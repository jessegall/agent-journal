def ago(at: float, now: float) -> str:
    """How long before now a moment was, in the words the stop's lines use."""
    minutes = int((now - at) // 60)
    if minutes < 1:
        return "just now"
    return f"{minutes} min ago" if minutes < 60 else f"{minutes // 60} h ago"
