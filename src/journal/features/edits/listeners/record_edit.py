import time
from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_finished import ToolFinished
from journal.features.agent_listener import AgentListener
from journal.features.edits.patch_rows import PatchRows
from journal.models.actor import Actor
from journal.models.edit import Edit
from journal.repositories.edits import Edits

EDITING = ("Edit", "Write", "MultiEdit")


class RecordEdit(AgentListener[ToolFinished]):
    """When a tool that writes a file finishes, the change is kept as an edit row before the hook answers, so the pane that polls next sees it: the path inside the project, its changed lines and their counts."""

    blocking = True

    def __init__(self, config: Config, edits: Edits) -> None:
        self.config, self.edits = config, edits

    def handle(self, event: ToolFinished) -> None:
        path = event.input.get("file_path", "")
        if event.tool not in EDITING or not path:
            return
        rows = PatchRows.of(event.response, event.input, event.tool)
        numbered = [r["line"] for r in rows if r["line"]]
        edit = Edit(session=event.session, path=self.inside(path), kind="create" if event.tool == "Write" else "edit", at=time.time(),
                    added=len([r for r in rows if r["kind"] == "add"]), removed=len([r for r in rows if r["kind"] == "del"]),
                    first_line=min(numbered) if numbered else 1, last_line=max(numbered) if numbered else len(rows), rows=tuple(rows[:200]))
        self.edits.record(edit, Actor.agent(event.session))

    def inside(self, path: str) -> str:
        """The path as the project sees it: relative to the root, or the file's name when it lies outside."""
        try:
            return str(Path(path).resolve().relative_to(self.config.root.resolve()))
        except ValueError:
            return Path(path).name
