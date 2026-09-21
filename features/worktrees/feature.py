from pathlib import Path

from features.base import Feature, interceptor

EXCLUDED = "/.journal"


def checkout(start: Path) -> Path | None:
    for here in (start, *start.parents):
        marker = here / ".git"
        if marker.is_dir():
            return None
        if marker.is_file():
            return here if "/worktrees/" in marker.read_text() else None
    return None


def excluded(top: Path) -> None:
    gitdir = Path((top / ".git").read_text().split(":", 1)[1].strip())
    exclude = (gitdir if gitdir.is_absolute() else top / gitdir).resolve().parents[1] / "info" / "exclude"
    held = exclude.read_text() if exclude.is_file() else ""
    if EXCLUDED not in held.splitlines():
        exclude.parent.mkdir(parents=True, exist_ok=True)
        exclude.write_text(held + ("" if not held or held.endswith("\n") else "\n") + EXCLUDED + "\n")


class Worktrees(Feature):
    name = "worktrees"
    title_ = "Worktrees"
    abstract_ = "A git worktree of the project works from the project's journal: one with no journal of its own gets a link to it"
    help_ = ("When an agent or a subagent works in a linked git worktree that has no .journal, the journal links the worktree's .journal to the "
             "project's own, so every agent in every worktree writes one record. The link is kept out of git through the repository's exclude file. "
             "A worktree that carries a .journal of its own is left alone.")
    runs_for_subagents = True

    @interceptor
    def linked(self, provider, record, hook, session) -> str:
        top = checkout(Path(hook.cwd)) if hook.cwd else None
        journal = top / ".journal" if top else None
        if journal and not journal.exists() and not journal.is_symlink() and top.resolve() != record.root.resolve().parent:
            journal.symlink_to(record.root.resolve(), target_is_directory=True)
            excluded(top)
        return ""
