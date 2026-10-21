from dataclasses import dataclass


@dataclass(frozen=True)
class MessagesData:
    """The messages feature's reading: the unread messages, the read ones not answered and the folders of their files, the tool use the inbox reminder counts from, the newest message's coming or the inbox last named since, how often the unread were named since the newest came, and its own tool uses while a read message stays unanswered."""

    unread: tuple[int, ...]
    unanswered: tuple[int, ...]
    unanswered_files: tuple[str, ...]
    reminder_start: int
    mention_count: int
    uses_unanswered: int
