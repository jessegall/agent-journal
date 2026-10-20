from dataclasses import dataclass


@dataclass(frozen=True)
class MessagesStanding:
    """The messages feature's reading: the unread messages and the read ones not answered."""

    unread: tuple[int, ...]
    unanswered: tuple[int, ...]
