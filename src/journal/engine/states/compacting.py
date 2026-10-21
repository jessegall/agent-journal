from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.engine import Engine
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.engine.support.typist import Typist
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Compacting(BaseState):
    """The context is being compacted: every tool is held until the session starts again, which pops it. The state clears the typist's queue and disables it as it enters, and enables it as it leaves: a line the journal would type meanwhile is dropped, and the look at the start after the compaction brings the agent up to date."""

    name = "compacting"
    title = "Compacting"

    def on_enter(self, typist: Typist) -> None:
        typist.clear()
        typist.disable()

    def on_exit(self, typist: Typist) -> None:
        typist.enable()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.hold(Engine.NOTHING_WHILE_COMPACTING.create())

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.pop()
