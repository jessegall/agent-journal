from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.engine import Engine
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True)
class Compacting(BaseState):
    """The context is being compacted: every tool is held until the session starts again, which pops it; a row event or a tick stops with it, so no conduct speaks through it, and every line typed meanwhile waits for the pop. The state beneath catches up on resume."""

    name = "compacting"
    title = "Compacting"

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.hold(Engine.NOTHING_WHILE_COMPACTING.create())

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.pop()

    def on_row_event(self, event: RowEvent, settings: Settings) -> Transition:
        event.stop_propagation()
        return self.unchanged()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        event.stop_propagation()
        return self.unchanged()

    def is_silent(self) -> bool:
        return True
