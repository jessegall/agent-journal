from pathlib import Path

from controllers.types import Agents, Works
from engine.events.engine import FileEdited
from engine.files import KIND, line_counts
from engine.git import commits_since
from engine.command_runs import Delta, counted_runs, current_run
from resources.base import SYSTEM
from resources.shapes import CHANGE, COMMIT
from resources.types import AgentRow, Work


def files_of(record, n: int):
    return record.state(f"work-{n}")


def committed(project: Path, since: float) -> list[dict]:
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, subject in commits_since(project, since)]


def begin(event, record) -> None:
    files_of(record, event.n).clear()


def end(event, record) -> None:
    files_of(record, event.n).clear()


def record_edit(agent: AgentRow, record, work: Work, edit: FileEdited) -> None:
    project = record.root.parent
    with files_of(record, work.n).changing() as held:
        base = held.setdefault("base", {}).setdefault(edit.path, edit.before)
        made = held.setdefault("created", [])
        if edit.kind == KIND.created and edit.path not in made:
            made.append(edit.path)
        created = edit.path in made
    files = {f[CHANGE.path]: f for f in work.changed}
    if base == edit.after:
        files.pop(edit.path, None)
    else:
        total = line_counts(project, [(base, edit.after)])[(base, edit.after)]
        files[edit.path] = {CHANGE.path: edit.path, CHANGE.added: total.added, CHANGE.removed: total.removed, CHANGE.created: created}
    commits = committed(project, work.created)
    if list(files.values()) != work.changed or commits != work.commits:
        Works(record, actor=SYSTEM).update(work.n, changed=list(files.values()), commits=commits)
    finished = current_run(agent).finished
    agents = Agents(record, actor=SYSTEM)
    counted = counted_runs(agents.load(agent.n), finished.at if finished else 0.0, Delta.from_json({edit.kind: 1, "added": edit.added, "removed": edit.removed}),
                           [edit.path], [edit.path] if edit.kind == KIND.created else [])
    if counted:
        agents.update(agent.n, **counted)
