from dataclasses import dataclass

from journal.features.messages.support.peer_question import PeerQuestion


@dataclass(frozen=True)
class MessagesData:
    """The messages feature's reading: the unread messages, the read ones not answered and the folders of their files, the tool use the inbox reminder counts from, the newest message's coming or the inbox last named since, how often the unread were named since the newest came, its own tool uses while a read message stays unanswered, the questions other agents asked it that it has not answered, and the colleagues' comments it has not read."""

    unread: tuple[int, ...]
    unanswered: tuple[int, ...]
    unanswered_files: tuple[str, ...]
    inbox_tool_uses: int
    uses_unanswered: int
    peer_questions: tuple[PeerQuestion, ...]
    unread_comments: tuple[int, ...] = ()
