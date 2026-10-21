from dataclasses import dataclass


@dataclass(frozen=True)
class MessagesSnapshot:
    """The messages feature's reading: the unread messages, the read ones not answered and the folders of their files, the agent's own tool uses since the newest message came and how often the unread were named since, and its own tool uses while a read message stays unanswered."""

    unread: tuple[int, ...]
    unanswered: tuple[int, ...]
    unanswered_files: tuple[str, ...]
    uses_since_newest: int
    times_named: int
    uses_unanswered: int
