from dataclasses import replace
import time
from pathlib import Path

from controllers.types import Agents, Works
from providers import PROVIDERS
from features.status_bar.runs import Delta, command_runs, current_run
from resources.base import SYSTEM, names
from resources.shapes import CHANGE, COMMIT
from skills import LIBRARY
from engine.proc import run

DELTA = names("edited", "created", "deleted", "added", "removed")
NOTE = names("at", "path", "kind", "added", "removed")
KEPT = 200
EMPTY_BLOB = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"



def change_kind(path: str, last: dict, now: dict) -> str:
    if path not in last:
        return DELTA.created
    return DELTA.deleted if path not in now else DELTA.edited


def git(project: Path, *args: str, stdin: str | None = None) -> str:
    return run(["git", *args], project, stdin=stdin)


def internal(record, project: Path) -> tuple[str, ...]:
    roots = []
    for root in (record.root, record.root.resolve()):
        try:
            roots.append(str(root.relative_to(project)))
        except ValueError:
            try:
                roots.append(str(root.relative_to(project.resolve())))
            except ValueError:
                continue
    homes = (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))
    return (*(f"{r}/" for r in dict.fromkeys(roots)), *(f"{h}/journal" for h in homes))


def journals_own(path: str, marks: tuple[str, ...]) -> bool:
    return any(path.startswith(m) or path == m.rstrip("/") for m in marks)


def blobs(record, project: Path) -> dict:
    tree = {}
    for entry in git(project, "ls-files", "-s", "-z").split("\0"):
        meta, _, path = entry.partition("\t")
        if path:
            tree[path] = meta.split()[1]
    dirty = list(dict.fromkeys(p for p in git(project, "ls-files", "-m", "-o", "-d", "--exclude-standard", "-z").split("\0") if p))
    present = [p for p in dirty if (project / p).is_file()]
    for path in set(dirty) - set(present):
        tree.pop(path, None)
    shas = git(project, "hash-object", "-w", "--stdin-paths", stdin="\n".join(present)).split() if present else []
    if len(shas) == len(present):
        tree.update(zip(present, shas))
    marks = internal(record, project)
    return {path: sha for path, sha in tree.items() if not journals_own(path, marks)}


def numstat(project: Path, old: str, new: str) -> tuple[int, int]:
    added, removed = (git(project, "diff", "--numstat", old, new).split("\t") + ["", ""])[:2]
    return int(added) if added.isdigit() else 0, int(removed) if removed.isdigit() else 0


def files_of(record, n: int):
    return record.state(f"work-{n}")


def changes(record) -> list[dict]:
    return record.state("work_tracking").get("changes", [])


def noted(record, entries: list[dict]) -> None:
    if entries:
        with record.state("work_tracking").changing() as held:
            held["changes"] = [*held.get("changes", []), *entries][-KEPT:]


def committed(project: Path, since: float) -> list[dict]:
    out = git(project, "log", f"--since=@{int(since)}", "--format=%H%x1f%s")
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


TREES = ("base", "last")


def begin(event, record) -> None:
    now = blobs(record, record.root.parent)
    files_of(record, event.n).update({which: now for which in TREES})


def end(event, record) -> None:
    files_of(record, event.n).clear()


def record_files(agent, record, work) -> None:
    project = record.root.parent
    base, last, now = trees(record, work.n, project)
    delta = {DELTA.edited: 0, DELTA.created: 0, DELTA.deleted: 0, DELTA.added: 0, DELTA.removed: 0}
    files = {f[CHANGE.path]: f for f in work.changed}
    touched, entries, at = [], [], time.time()
    for path in sorted(p for p in set(last) | set(now) if last.get(p) != now.get(p)):
        touched.append(path)
        added, removed = numstat(project, last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB))
        kind = change_kind(path, last, now)
        entries.append({NOTE.at: at, NOTE.path: path, NOTE.kind: kind, NOTE.added: added, NOTE.removed: removed})
        delta[kind] += 1
        delta[DELTA.added] += added
        delta[DELTA.removed] += removed
        if base.get(path) == now.get(path):
            files.pop(path, None)
            continue
        total_added, total_removed = numstat(project, base.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB))
        files[path] = {CHANGE.path: path, CHANGE.added: total_added, CHANGE.removed: total_removed, CHANGE.created: path not in base}
    noted(record, entries)
    commits = committed(project, work.created)
    if list(files.values()) != work.changed or commits != work.commits:
        Works(record, actor=SYSTEM).update(work.n, changed=list(files.values()), commits=commits)
    counts = Delta(**delta)
    if counts.changed_files:
        finished = current_run(agent).finished
        count(record, agent.n, finished.at if finished else 0.0, counts, touched, [e[NOTE.path] for e in entries if e[NOTE.kind] == DELTA.created])


def trees(record, n: int, project: Path) -> tuple[dict, dict, dict]:
    with files_of(record, n).changing() as held:
        now = blobs(record, project)
        last = held.get("last")
        base = held.setdefault("base", last if last is not None else now)
        held["last"] = now
    return base, now if last is None else last, now


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
