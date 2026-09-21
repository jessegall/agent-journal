import fcntl
import time
from pathlib import Path

from controllers.types import Agents, Works
from engine.stored import read_json, write_json
from providers import PROVIDERS
from features.status_bar.commands import WRITES
from resources.base import SYSTEM, names
from resources.shapes import CHANGE, COMMIT
from resources.types import COMMAND, RUNNING
from skills import LIBRARY
from engine.proc import run

DELTA = names("edited", "created", "deleted", "added", "removed")
NOTE = names("at", "path", "kind", "added", "removed")
KEPT = 200
EMPTY_BLOB = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"


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


def tree_file(record, n: int, which: str) -> Path:
    return record.home / "runtime" / f"files-{n}-{which}.json"


def changes_file(record) -> Path:
    return record.home / "runtime" / "changes.json"


def changes(record) -> list[dict]:
    return read_json(changes_file(record)) or []


def noted(record, entries: list[dict]) -> None:
    if entries:
        write_json(changes_file(record), [*changes(record), *entries][-KEPT:])


def committed(project: Path, since: float) -> list[dict]:
    out = git(project, "log", f"--since=@{int(since)}", "--format=%H%x1f%s")
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


TREES = ("base", "last")


def begin(event, record) -> None:
    now = blobs(record, record.root.parent)
    for which in TREES:
        write_json(tree_file(record, event.n, which), now)


def end(event, record) -> None:
    for which in TREES:
        tree_file(record, event.n, which).unlink(missing_ok=True)


def record_files(agent, record, work) -> None:
    project = record.root.parent
    base, last, now = trees(record, work.n, project)
    delta = {DELTA.edited: 0, DELTA.created: 0, DELTA.deleted: 0, DELTA.added: 0, DELTA.removed: 0}
    files = {f[CHANGE.path]: f for f in work.changed}
    touched, entries, at = [], [], time.time()
    for path in sorted(p for p in set(last) | set(now) if last.get(p) != now.get(p)):
        touched.append(path)
        added, removed = numstat(project, last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB))
        kind = DELTA.created if path not in last else DELTA.deleted if path not in now else DELTA.edited
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
    if any(delta[k] for k in (DELTA.edited, DELTA.created, DELTA.deleted)):
        count(record, agent.n, finished(agent.running), delta, touched, [e[NOTE.path] for e in entries if e[NOTE.kind] == DELTA.created])


def trees(record, n: int, project: Path) -> tuple[dict, dict, dict]:
    last_file = tree_file(record, n, "last")
    last_file.parent.mkdir(parents=True, exist_ok=True)
    with last_file.with_suffix(".lock").open("w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        now = blobs(record, project)
        last = read_json(last_file)
        base = read_json(tree_file(record, n, "base"))
        if base is None:
            base = last if last is not None else now
            write_json(tree_file(record, n, "base"), base)
        write_json(last_file, now)
    return base, now if last is None else last, now


def finished(running: dict) -> float:
    run = running if running.get(RUNNING.done) else running.get(RUNNING.before) or {}
    return run.get(RUNNING.at, 0)


def could_write(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") in ("Bash", *WRITES)


def count(record, n: int, ran: float, delta: dict, touched: list, made: list) -> None:
    agents = Agents(record, actor=SYSTEM)
    row = agents.load(n)
    running = row.running
    late = running.get(RUNNING.at) != ran
    edited = running.get(RUNNING.before) or {} if late else running
    if not ran or edited.get(RUNNING.at) != ran:
        return
    prior = edited.get(RUNNING.changed) or {}
    known = edited.get(RUNNING.files) or []
    fresh = edited.get(RUNNING.made) or []
    edited = {**edited, RUNNING.changed: {key: prior.get(key, 0) + value for key, value in delta.items()},
              RUNNING.files: [*known, *(p for p in touched if p not in known)],
              RUNNING.made: [*fresh, *(p for p in made if p not in fresh)]}
    agents.update(n, running={**running, RUNNING.before: edited} if late else edited,
                  commands=[{**one, COMMAND.files: edited[RUNNING.files], COMMAND.made: edited[RUNNING.made],
                              COMMAND.changed: edited[RUNNING.changed]}
                            if one.get(COMMAND.at) == ran and could_write(one) else one for one in row.commands])
