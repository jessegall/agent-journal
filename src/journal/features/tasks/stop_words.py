def ago(time: float, now: float) -> str:
    minutes = int((now - time) // 60)
    if minutes < 1:
        return "just now"
    return f"{minutes} min ago" if minutes < 60 else f"{minutes // 60} h ago"
