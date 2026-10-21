import time
from dataclasses import asdict
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.edits.support.file_snapshots import FileSnapshots
from journal.features.edits.support.patch_rows import PatchRows
from journal.features.shell.support.part import Part
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.repositories.edits import Edits

EDITING = ("Edit", "Write", "MultiEdit")
ROWS_KEPT = 200


class RecordEdit(AgentListener[ToolFinished]):
    """When a call that writes files ends, each file it wrote is kept as an edit row before the hook answers, so the pane that polls next sees it: the editor's tools from the patch they answer with, a shell line from the call's written paths against the file as the journal saw it last; the file as it now is is kept, so the next change is told against it."""

    blocking = True

    def __init__(self, config: Config, edits: Edits, snapshots: FileSnapshots) -> None:
        self.config, self.edits, self.snapshots = config, edits, snapshots

    def handle(self, event: ToolFinished) -> None:
        if event.call.tool in EDITING:
            self.patched(event)
            return
        for path in dict.fromkeys(self.project_path(p) for p in event.call.written_paths if Part.is_under_project(p)):
            self.changed(event, path)

    def patched(self, event: ToolFinished) -> None:
        path = event.call.input.get("file_path", "")
        if not path:
            return
        patch = PatchRows.of(event.response, event.call.input, event.call.tool)
        self.recorded(Edit(session=event.session, path=self.project_path(path), kind="create" if event.call.tool == "Write" else "edit", at=time.time(),
                       added=patch.counted("add"), removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:ROWS_KEPT])), event)

    def changed(self, event: ToolFinished, path: str) -> None:
        text = self.snapshots.now(path)
        if text is None:
            return
        before = self.snapshots.before(path)
        patch = PatchRows.between(before, text)
        if not patch.rows:
            return
        self.recorded(Edit(session=event.session, path=path, kind="create" if not before else "edit", at=time.time(), command=event.call.command,
                       added=patch.counted("add"), removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:ROWS_KEPT])), event)

    def recorded(self, edit: Edit, event: ToolFinished) -> None:
        self.edits.record(edit, Actor.agent(event.session))
        text = self.snapshots.now(edit.path)
        if text is not None:
            self.snapshots.keep(edit.path, text)

    def project_path(self, path: str) -> str:
        try:
            return str(Path(path).resolve().relative_to(self.config.root.resolve()))
        except ValueError:
            return Path(path).name
