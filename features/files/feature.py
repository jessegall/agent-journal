import subprocess
from pathlib import Path

from controllers.types import Agents, Works
from features.base import Feature, on
from resources.base import SYSTEM, names
from resources.shapes import CHANGE, COMMIT
from resources.types import RUNNING

DELTA = names("edited", "created", "deleted", "added", "removed")


def git(project: Path, *args: str) -> str:
    try:
        return subprocess.run(["git", *args], cwd=project, capture_output=True, text=True, timeout=5).stdout
    except (OSError, subprocess.SubprocessError):
        return ""


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


def committed(project: Path, since: float) -> list[dict]:
    out = git(project, "log", f"--since=@{int(since)}", "--format=%H%x1f%s")
    return [{COMMIT.sha: sha, COMMIT.subject: subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


class Files(Feature):
    name = "files"
    title_ = "Files changed"
    abstract_ = "Every file a piece of work changes, and every commit made during it, is recorded on the work"
    help_ = "After a write the changed paths are read from git and kept on the open work with their line counts; a script's writes count too."

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
            before = {f[CHANGE.path]: (f[CHANGE.added], f[CHANGE.removed]) for f in files.values()}
            delta = {DELTA.edited: 0, DELTA.created: 0, DELTA.deleted: 0, DELTA.added: 0, DELTA.removed: 0}
            now = changed(project, only)
            for f in now:
                files[f[CHANGE.path]] = f
                was = before.get(f[CHANGE.path], (0, 0))
                if f[CHANGE.path] not in before and f[CHANGE.created]:
                    delta[DELTA.created] += 1
                elif was != (f[CHANGE.added], f[CHANGE.removed]):
                    delta[DELTA.edited] += 1
                else:
                    continue
                delta[DELTA.added] += max(0, f[CHANGE.added] - was[0])
                delta[DELTA.removed] += max(0, f[CHANGE.removed] - was[1])
            for path in [p for p in before if p not in {f[CHANGE.path] for f in now} and (only in ("", p)) and not (project / p).exists()]:
                delta[DELTA.deleted] += 1
                files.pop(path)
            commits = committed(project, work.created)
            if list(files.values()) != work.changed or commits != work.commits:
                works.update(work.n, changed=list(files.values()), commits=commits)
            if agent.running and any(delta[k] for k in (DELTA.edited, DELTA.created, DELTA.deleted)):
                Agents(record, actor=SYSTEM).update(agent.n, running={**agent.running, RUNNING.changed: delta})
