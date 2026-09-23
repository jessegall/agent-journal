from dataclasses import replace
from pathlib import Path

from controllers.types import Agents, Works
from engine.events import FileEdited
from engine.files import KIND, line_counts
from engine.proc import git
from features.status_bar.runs import Delta, command_runs, current_run
from resources.base import SYSTEM
from resources.shapes import CHANGE, COMMIT
from resources.types import AgentRow, Work


def files_of(record, n: int):
    return record.state(f"work-{n}")


def committed(project: Path, since: float) -> list[dict]:
    out = git(["log", f"--since=@{int(since)}", "--format=%H%x1f%s"], project)
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


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
        count = line_counts(project, [(base, edit.after)])[(base, edit.after)]
        files[edit.path] = {CHANGE.path: edit.path, CHANGE.added: count.added, CHANGE.removed: count.removed, CHANGE.created: created}
    commits = committed(project, work.created)
    if list(files.values()) != work.changed or commits != work.commits:
        Works(record, actor=SYSTEM).update(work.n, changed=list(files.values()), commits=commits)
    finished = current_run(agent).finished
    count(record, agent.n, finished.at if finished else 0.0, Delta.from_json({edit.kind: 1, "added": edit.added, "removed": edit.removed}),
          [edit.path], [edit.path] if edit.kind == KIND.created else [])


def count(record, n: int, ran: float, delta: Delta, touched: list, made: list) -> None:
    agents = Agents(record, actor=SYSTEM)
    row = agents.load(n)
    running = current_run(row)
    late = running.at != ran
    edited = running.before if late else running
    if not ran or edited is None or edited.at != ran:
        return
    edited = edited.counted(delta, touched, made)
    runs = [replace(one, files=edited.files, made=edited.made, changed=edited.changed) if one.at == ran and one.could_write else one for one in command_runs(row)]
    agents.update(n, running=(replace(running, before=edited) if late else edited).to_json(), commands=[one.to_json() for one in runs])
