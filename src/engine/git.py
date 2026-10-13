from pathlib import Path

from engine.proc import git
from resources.commit_logs import CommitsAsked
from resources.checkout import BRANCH_REF, Checkout, DETACHED, MAIN, REMOTE_DEFAULT  # noqa: F401

def checkout_of(folder: Path) -> Checkout | None:
    for top in (folder, *folder.parents):
        marker = top / ".git"
        if marker.is_dir():
            return Checkout(top, marker, False)
        if marker.is_file():
            return Checkout(top, Path(marker.read_text().removeprefix("gitdir:").strip()), True)
    return None


def git_user_name(project: Path) -> str:
    return git(["config", "user.name"], project, timeout=2).strip()


def commits_since(project: Path, asked: CommitsAsked) -> list[tuple[str, str]]:
    limit = [f"-n{asked.most}"] if asked.most else []
    out = git(["log", f"--since=@{int(asked.since)}", "--format=%H%x1f%s", *limit], project, timeout=asked.timeout)
    return [(sha, subject) for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


def config_changed_at(project: Path) -> float:
    files = [Path.home() / ".gitconfig"]
    checkout = checkout_of(project)
    if checkout:
        files.append(checkout.config)
    return max((f.stat().st_mtime for f in files if f.is_file()), default=0.0)
