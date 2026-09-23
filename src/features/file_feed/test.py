import subprocess
from dataclasses import dataclass
from pathlib import Path

from controllers.types import Agents
from engine.files import announce
from features.file_feed.feed import edits_since
from engine.record import Record
from tests.conftest import fresh


@dataclass(frozen=True)
class Project:
    record: Record
    root: Path
    agent: int

    def changed(self) -> None:
        announce(self.record, self.agent)


def project_with(files: dict[str, str]) -> Project:
    record = fresh()
    project = record.root.parent
    for name, text in files.items():
        (project / name).write_text(text)
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
        subprocess.run(["git", *command], cwd=project, capture_output=True, timeout=10)
    row = Agents(record, actor="system").by_session("claude-1")
    announce(record, row.n)
    return Project(record, project, row.n)


def test_a_changed_file_becomes_a_card_and_the_cursor_reads_only_what_came_after():
    lines = [f"line {i}" for i in range(1, 51)]
    project = project_with({"a.py": "\n".join(lines) + "\n"})
    lines[3], lines[44] = "LINE 4", "LINE 45"
    (project.root / "a.py").write_text("\n".join(lines) + "\n")
    project.changed()
    first = edits_since(project.record, project.agent, 0)
    card = first.edits[0]
    assert (card.path, card.kind, card.added, card.removed, card.first_line, card.last_line) == ("a.py", "edit", 2, 2, 1, 48), \
        "a shell edit is a card, counted and placed"
    assert [(r.kind, r.line) for r in card.rows][2:6] == [("ctx", 3), ("del", 4), ("add", 4), ("ctx", 5)], "the change sits between its context"
    assert "fold" in [r.kind for r in card.rows], "the unchanged lines between changes fold to one row"
    (project.root / "new.py").write_text("one\ntwo\n")
    project.changed()
    after = edits_since(project.record, project.agent, first.cursor)
    assert [(c.path, c.kind, [r.kind for r in c.rows]) for c in after.edits] == [("new.py", "new", ["add", "add"])], "a new file is all added lines"


def test_a_deleted_file_is_one_line_with_its_removed_count():
    project = project_with({"old.md": "a\nb\nc\n"})
    (project.root / "old.md").unlink()
    project.changed()
    card = edits_since(project.record, project.agent, 0).edits[0]
    assert (card.kind, card.removed, card.rows) == ("deleted", 3, ()), "a deleted file carries no diff rows"
