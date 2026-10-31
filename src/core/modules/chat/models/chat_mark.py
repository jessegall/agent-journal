from dataclasses import dataclass

from core.base.actor import Actor
from core.base.chat.mark_outcome import MarkOutcome
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.chat.models.lifecycles.chat_mark_lifecycle import ChatMarkLifecycle


@dataclass(frozen=True, kw_only=True)
class ChatMark(Model):
    """One mark in an environment's chat, of a type a module declared: its words, the row it is about, how it
    stands, and, for a mark that follows a process, whether it still runs. Its lines are kept one to a line of
    text."""

    model_name = "chat_mark"
    cli_name = "chat-mark"
    lifecycle = ChatMarkLifecycle

    environment_id: int
    agent_id: int | None = None
    creator_id: int
    type: str
    variant: str
    key: str
    text: str
    detail: str = ""
    lines: str = ""
    target_model: str = ""
    target_id: int | None = None
    outcome: MarkOutcome = MarkOutcome.NONE
    figure: str = ""
    fraction: float = 0.0
    run_key: str = ""
    run_step: int = 0
    state: ChatMarkState = ChatMarkState.SHOWN
    ended_at: Timestamp | None = None

    def end(self, timestamp: Timestamp, actor: Actor) -> "ChatMark":
        return self.moved(ChatMarkLifecycle.end, ended_at=timestamp)
