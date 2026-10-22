from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.support.permission import Permission


@dataclass(frozen=True)
class FixingReader(BaseState):
    """A reader was asked three times to read better on its card: every tool but a journal command waits until the reader is written anew, then the state pops and the agent goes back to what it was doing."""

    name = "fixing_reader"
    title = "Fixing a reader"
    allows = frozenset({Permission.RUN_COMMANDS})
    reader: str = ""
    reader_form: str = ""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        if event.call.is_journal or event.subagent:
            return self.none()
        return self.refuse(Shell.READER_REWRITE_REQUEST.create(reader=self.reader))

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        current = next((repr(reader) for reader in event.data.part(Shell).readers if reader.name == self.reader), "")
        return self.pop(Shell.READER_REWRITE_NOTICE.create(reader=self.reader)) if current != self.reader_form else self.none()
