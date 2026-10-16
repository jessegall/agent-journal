import time


def ago(at: float) -> str:
    """How long ago a moment was, in the words the stop's lines use."""
    minutes = int((time.time() - at) // 60)
    return "just now" if minutes < 1 else f"{minutes} min ago" if minutes < 60 else f"{minutes // 60} h ago"
