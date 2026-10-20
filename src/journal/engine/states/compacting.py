from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.engine import Engine
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Compacting(BaseState):
    """The context is being compacted: every tool is held until the session starts again, which pops it."""

    name = "compacting"
    title = "Compacting"

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.hold(Engine.NOTHING_WHILE_COMPACTING.create())

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.pop()
