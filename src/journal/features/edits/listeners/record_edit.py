import time as timing
from dataclasses import asdict
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.edits.support.file_copies import FileCopies
from journal.features.edits.support.file_modification_tracker import FileModificationTracker
from journal.features.edits.support.patch_rows import PatchRows
from journal.support.part import Part
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.repositories.edits import Edits

EDITING = ("Edit", "Write", "MultiEdit")
ROW_COUNT = 200


class RecordEdit(AgentListener[ToolFinished]):
    """When a call that writes files ends, each file it wrote is kept as an edit row before the hook answers, so the pane that polls next sees it: the editor's tools from the patch they answer with, or from the file against its last copy when they answer with none, a shell line from the call's written paths against the file as the journal saw it last; the file as it now is is kept, so the next change is told against it. A script that writes files by paths it builds is found by the files whose modification time moved."""

    blocking = True

    def __init__(self, config: Config, edits: Edits, copies: FileCopies, modified_at: FileModificationTracker) -> None:
        self.config, self.edits, self.copies, self.modified_at = config, edits, copies, modified_at

    def handle(self, event: ToolFinished) -> None:
        if event.call.is_journal:
            return
        if event.call.tool in EDITING:
            self.patched(event)
            return
        call_paths = [p for p in event.call.edited_paths if Part.is_project_file(p)]
        for path in dict.fromkeys(self.project_path(p) for p in [*call_paths, *self.modified_at.moved(event.tool_use)]):
            if not Part.is_journal_owned(path):
                self.changed(event, path)

    def patched(self, event: ToolFinished) -> None:
        if not event.call.edited_paths:
            return
        path = self.project_path(event.call.edited_paths[0])
        if Part.is_journal_owned(path):
            return
        patch = PatchRows.build(event.response)
        if not patch.rows:
            self.changed(event, path)
            return
        self.recorded(Edit(session=event.session, tool_use=event.tool_use, path=path, kind="create" if event.call.tool == "Write" else "edit", time=timing.time(),
                       added=patch.counted("add"), removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:ROW_COUNT])), event)

    def changed(self, event: ToolFinished, path: str) -> None:
        text = self.copies.current_text(path)
        last_text = self.copies.last_text(path)
        if text is None:
            self.deleted(event, path, last_text)
            return
        patch = PatchRows.version_rows(last_text, text)
        if not patch.rows:
            return
        self.recorded(Edit(session=event.session, tool_use=event.tool_use, path=path, kind="create" if not last_text else "edit", time=timing.time(), command=event.call.command,
                       added=patch.counted("add"), removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:ROW_COUNT])), event)

    def deleted(self, event: ToolFinished, path: str, last_text: str) -> None:
        if not last_text:
            return
        patch = PatchRows.version_rows(last_text, "")
        self.edits.record(Edit(session=event.session, tool_use=event.tool_use, path=path, kind="delete", time=timing.time(), command=event.call.command, added=0, removed=patch.counted("del"), first_line=patch.first_line, last_line=patch.last_line, rows=tuple(asdict(r) for r in patch.rows[:ROW_COUNT])), Actor.agent(event.session))
        self.copies.store(path, "")

    def recorded(self, edit: Edit, event: ToolFinished) -> None:
        self.edits.record(edit, Actor.agent(event.session))
        text = self.copies.current_text(edit.path)
        if text is not None:
            self.copies.store(edit.path, text)

    def project_path(self, path: str) -> str:
        try:
            return str(Path(path).resolve().relative_to(self.config.root.resolve()))
        except ValueError:
            return Path(path).name
