import fcntl
import hashlib
import json
import subprocess
from pathlib import Path

from controllers.types import Agents, Works
from features.base import Feature, on
from providers import PROVIDERS
from resources.base import SYSTEM, names
from resources.shapes import CHANGE, COMMIT
from resources.types import RUNNING
from skills import LIBRARY

DELTA = names("edited", "created", "deleted", "added", "removed")
STATE = names("hash", "lines")
EMPTY_BLOB = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"


def git(project: Path, *args: str, stdin: str | None = None) -> str:
    try:
        return subprocess.run(["git", *args], cwd=project, input=stdin, capture_output=True, text=True, timeout=5).stdout
    except (OSError, subprocess.SubprocessError):
        return ""


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
    return (*(f"{r}/" for r in dict.fromkeys(roots)), *(f"{h}/journal" for h in homes), *(f"{h}/style-" for h in homes))


def journals_own(path: str, marks: tuple[str, ...]) -> bool:
    return any(path.startswith(m) or path == m.rstrip("/") for m in marks)


def changed(project: Path, only: str = "") -> list[dict]:
    paths = [only] if only else []
    out = []
    for line in git(project, "diff", "--numstat", "HEAD", "--", *paths).splitlines():
        added, removed, path = (line.split("\t", 2) + ["", ""])[:3]
        if path:
            out.append({CHANGE.path: path, CHANGE.added: int(added) if added.isdigit() else 0, CHANGE.removed: int(removed) if removed.isdigit() else 0, CHANGE.created: False})
    for path in git(project, "ls-files", "--others", "--exclude-standard", "--", *paths).splitlines():
        try:
            lines = sum(1 for _ in (project / path).open(errors="replace"))
        except OSError:
            lines = 0
        out.append({CHANGE.path: path, CHANGE.added: lines, CHANGE.removed: 0, CHANGE.created: True})
    return out


def state(project: Path, only: str = "") -> dict:
    paths = [only] if only else []
    found = git(project, "ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", *paths).split("\0")
    out = {}
    for path in (path for path in found if path):
        try:
            data = (project / path).read_bytes()
            out[path] = {STATE.hash: hashlib.sha256(data).hexdigest(), STATE.lines: len(data.splitlines())}
        except OSError:
            out[path] = None
    return out


def baseline_file(record, n: int) -> Path:
    return record.home / "runtime" / f"files-{n}.json"


def source_state(record, project: Path, only: str = "") -> dict:
    marks = internal(record, project)
    return {path: value for path, value in state(project, only).items() if not journals_own(path, marks)}


def read_baseline(record, work, project: Path) -> dict:
    path = baseline_file(record, work.n)
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        before = source_state(record, project)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(before))
        return before


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


def step(project: Path, last: dict, now: dict) -> dict:
    delta = {DELTA.edited: 0, DELTA.created: 0, DELTA.deleted: 0, DELTA.added: 0, DELTA.removed: 0}
    for path in set(last) | set(now):
        old, new = last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB)
        if old == new:
            continue
        delta[DELTA.created if path not in last else DELTA.deleted if path not in now else DELTA.edited] += 1
        added, removed = (git(project, "diff", "--numstat", old, new).split("\t") + ["", ""])[:2]
        delta[DELTA.added] += int(added) if added.isdigit() else 0
        delta[DELTA.removed] += int(removed) if removed.isdigit() else 0
    return delta


def snapshot_file(record, n: int) -> Path:
    return record.home / "runtime" / f"files-{n}-blobs.json"


def committed(project: Path, since: float) -> list[dict]:
    out = git(project, "log", f"--since=@{int(since)}", "--format=%H%x1f%s")
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


class Files(Feature):
    name = "files"
    title_ = "Files changed"
    abstract_ = "Every file a piece of work changes, and every commit made during it, is recorded on the work"
    help_ = "The work's opening tree is its baseline; after a write, only paths changed since then are kept with their line counts. A script's writes count too."

    @on("work.created")
    def begin(self, event, record) -> None:
        work = Works(record, actor=SYSTEM).load(event.n)
        read_baseline(record, work, record.root.parent)
        self.stepped(record, work.n, record.root.parent)

    @on("work.completed")
    def end(self, event, record) -> None:
        baseline_file(record, event.n).unlink(missing_ok=True)
        snapshot_file(record, event.n).unlink(missing_ok=True)

    @on("agent.updated")
    def record_files(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.event != "PostToolUse":
            return
        works = Works(record, actor=SYSTEM)
        for work in self.standing(record, "work")[:1]:
            project = record.root.parent
            file = agent.file or ""
            only = str(Path(file).resolve().relative_to(project.resolve())) if file and file.startswith(str(project)) else ""
            files = {f[CHANGE.path]: f for f in work.changed}
            delta = self.stepped(record, work.n, project)
            baseline = read_baseline(record, work, project)
            current = source_state(record, project, only)
            paths = {only} if only else set(baseline) | set(current)
            touched = {path for path in paths if baseline.get(path) != current.get(path)}
            marks = internal(record, project)
            now = {f[CHANGE.path]: f for f in changed(project, only) if f[CHANGE.path] in touched and not journals_own(f[CHANGE.path], marks)}
            for path in touched - set(now):
                old, new = baseline.get(path), current.get(path)
                old_lines = old[STATE.lines] if old else 0
                new_lines = new[STATE.lines] if new else 0
                now[path] = {CHANGE.path: path, CHANGE.added: max(0, new_lines - old_lines), CHANGE.removed: max(0, old_lines - new_lines), CHANGE.created: old is None and new is not None}
            files.update(now)
            commits = committed(project, work.created)
            if list(files.values()) != work.changed or commits != work.commits:
                works.update(work.n, changed=list(files.values()), commits=commits)
            if any(delta[k] for k in (DELTA.edited, DELTA.created, DELTA.deleted)):
                self.count(record, agent.n, self.finished(agent.running), delta)

    def stepped(self, record, n: int, project: Path) -> dict:
        snapshot = snapshot_file(record, n)
        snapshot.parent.mkdir(parents=True, exist_ok=True)
        with snapshot.with_suffix(".lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                last = json.loads(snapshot.read_text())
            except (OSError, ValueError):
                last = None
            now = blobs(record, project)
            snapshot.write_text(json.dumps(now))
        return step(project, last if last is not None else now, now)

    def finished(self, running: dict) -> float:
        run = running if running.get(RUNNING.done) else running.get(RUNNING.before) or {}
        return run.get(RUNNING.at, 0)

    def count(self, record, n: int, ran: float, delta: dict) -> None:
        agents = Agents(record, actor=SYSTEM)
        running = agents.load(n).running
        late = running.get(RUNNING.at) != ran
        edited = running.get(RUNNING.before) or {} if late else running
        if not ran or edited.get(RUNNING.at) != ran:
            return
        prior = edited.get(RUNNING.changed) or {}
        edited = {**edited, RUNNING.changed: {key: prior.get(key, 0) + value for key, value in delta.items()}}
        agents.update(n, running={**running, RUNNING.before: edited} if late else edited)
