import time
from dataclasses import asdict
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.edits.support.file_snapshots import FileSnapshots
from journal.features.edits.support.patch_rows import PatchRows
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.repositories.edits import Edits

EDITING = ("Edit", "Write", "MultiEdit")


class RecordEdit(AgentListener[ToolFinished]):
    """When a tool that writes a file finishes, the change is kept as an edit row before the hook answers, so the pane that polls next sees it: the path inside the project, its changed lines and their counts; the file as it now is is kept, so a later shell command's change to it is told against it."""

    blocking = True

    def __init__(self, config: Config, edits: Edits, snapshots: FileSnapshots) -> None:
        self.config, self.edits, self.snapshots = config, edits, snapshots

    def handle(self, event: ToolFinished) -> None:
        path = event.input.get("file_path", "")
        if event.tool not in EDITING or not path:
            return
        patch = PatchRows.of(event.response, event.input, event.tool)
        edit = Edit(session=event.session, path=self.inside(path), kind="create" if event.tool == "Write" else "edit", at=time.time(),
                    added=patch.counted("add"), removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:200]))
        self.edits.record(edit, Actor.agent(event.session))
        text = self.snapshots.now(edit.path)
        if text is not None:
            self.snapshots.keep(edit.path, text)

    def inside(self, path: str) -> str:
        """The path as the project sees it: relative to the root, or the file's name when it lies outside."""
        try:
            return str(Path(path).resolve().relative_to(self.config.root.resolve()))
        except ValueError:
            return Path(path).name
