from datetime import timedelta
from engine.model.prunable import Prunable
from engine.query.conditions.among import Among
from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.enums.mark_outcome import MarkOutcome
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.session_bound import SessionBound
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.chat.models.lifecycles.chat_mark_lifecycle import ChatMarkLifecycle

PRUNABLE_MARK_STATES = (ChatMarkState.SHOWN, ChatMarkState.ENDED)


@dataclass(frozen=True, kw_only=True)
class ChatMark(Prunable, EnvironmentScoped, SessionBound, Model):
    """One mark in an environment's chat, of a type a module declared: its words, the row it is about, how it
    stands, and, for a mark that follows a process, whether it still runs. Its lines are kept one to a line of
    text."""

    kept_for = timedelta(days=3)

    model_name = "chat_mark"
    cli_name = "chat-mark"
    lifecycle = ChatMarkLifecycle

    environment_id: int = 0
    session_agent_id: int | None = None
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

    @classmethod
    def prunable(cls, query, now):
        return super().prunable(query, now).matching(Among("state", PRUNABLE_MARK_STATES))
