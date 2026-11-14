from enum import StrEnum


class LineDelivery(StrEnum):
    """How a line that wakes an idle agent reaches it: typed into its terminal, or given to its program's wake hook,
    which falls back to the terminal when no wake hook waits."""

    TERMINAL_TYPING = "terminal_typing"
    WAKE_HOOK = "wake_hook"
