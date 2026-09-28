from pathlib import Path

from engine.events import AgentReported
from features.parts import AgentContext, Handler

MAIN = "the main checkout"
DETACHED = "a detached head"


def checkout_of(folder: Path) -> tuple[str, Path] | None:
    for place in (folder, *folder.parents):
        dot_git = place / ".git"
        if dot_git.is_dir():
            return MAIN, dot_git / "HEAD"
        if dot_git.is_file():
            return f"worktree {place.name}", Path(dot_git.read_text().removeprefix("gitdir:").strip()) / "HEAD"
    return None


def branch_in(head: Path) -> str:
    try:
        text = head.read_text().strip()
    except OSError:
        return ""
    return text.removeprefix("ref: refs/heads/") if text.startswith("ref: refs/heads/") else DETACHED


class MarkBranchSwitches(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        found = checkout_of(Path(row.cwd) if row.cwd else context.record.root.parent)
        if not found:
            return
        name, head = found
        branch = branch_in(head)
        before = context.state.get(name)
        if not branch or before == branch:
            return
        context.state.set(name, branch)
        if before is None and name == MAIN:
            return
        label = f"{name} started on `{branch}`" if before is None else f"{name} switched from `{before}` to `{branch}`"
        context.journal.agents.card(row.n, label=label[:1].upper() + label[1:], icon="branch", tone="commit")
