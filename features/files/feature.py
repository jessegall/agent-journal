import subprocess
from pathlib import Path

from controllers.types import CONTROLLERS
from features.base import Feature, on
from resources.base import SYSTEM


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
            out.append({"path": path, "added": int(added) if added.isdigit() else 0, "removed": int(removed) if removed.isdigit() else 0, "created": False})
    for path in git(project, "ls-files", "--others", "--exclude-standard", "--", *paths).splitlines():
        try:
            lines = sum(1 for _ in (project / path).open(errors="replace"))
        except OSError:
            lines = 0
        out.append({"path": path, "added": lines, "removed": 0, "created": True})
    return out


def committed(project: Path, since: float) -> list[dict]:
    out = git(project, "log", f"--since=@{int(since)}", "--format=%H%x1f%s")
    return [{"sha": sha, "subject": subject} for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


class Files(Feature):
    name = "files"
    title_ = "Files changed"
    abstract_ = "Every file a piece of work changes, and every commit made during it, is recorded on the work"
    help_ = "After a write the changed paths are read from git and kept on the open work with their line counts; a script's writes count too."

    @on("agent.updated")
    def record_files(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.data.get("event") != "PostToolUse" or not agent.data.get("wrote"):
            return
        works = CONTROLLERS["work"](record, actor=SYSTEM)
        for work in self.standing(record, "work")[:1]:
            project = record.root.parent
            file = agent.data.get("file") or ""
            only = str(Path(file).resolve().relative_to(project.resolve())) if file and file.startswith(str(project)) else ""
            files = {f["path"]: f for f in work.data.get("changed") or []}
            for f in changed(project, only):
                files[f["path"]] = f
            works.update(work.n, changed=list(files.values()), commits=committed(project, work.created))
