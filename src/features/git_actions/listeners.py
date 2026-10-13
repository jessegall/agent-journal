from pathlib import Path

from events import Fact
from events.agents import AgentReported, CommandRan
from events.git_actions import BranchNoted, BranchSwitched, GitActionDone
from features.git_actions.actions import calls
from receiving import Listener
from resources.runs import SHELL, STEP
from resources.types import AgentRow
from serving import ReadElsewhere, ReadGit, ReadRemembered, ReadRows


def working_folder(row: AgentRow, elsewhere: ReadElsewhere) -> Path:
    """Where the agent works: its own folder when it has one, else the project's."""
    cwd = Path(row.cwd) if row.cwd else None
    return cwd if cwd and cwd.is_dir() else elsewhere.here().record.root.parent


def branch_key(checkout_name: str, agent: int) -> str:
    return f"{checkout_name}|{agent}"


def branch_label(checkout, before: str | None) -> str:
    label = f"{checkout.name} started on `{checkout.branch}`" if before is None else f"{checkout.name} switched from `{before}` to `{checkout.branch}`"
    return label[:1].upper() + label[1:]


class SpotBranchSwitch(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], git: ReadGit, elsewhere: ReadElsewhere, remembered: ReadRemembered) -> list[Fact]:
        checkout = git.checkout(working_folder(agents.peek(event.agent), elsewhere))
        if not checkout or not checkout.branch:
            return []
        before = remembered.get(branch_key(checkout.name, event.agent))
        if before == checkout.branch:
            return []
        if before is None and not checkout.linked:
            return [BranchNoted(agent=event.agent, checkout=checkout.name, branch=checkout.branch)]
        return [BranchSwitched(agent=event.agent, checkout=checkout.name, branch=checkout.branch, label=branch_label(checkout, before))]


class SpotGitAction(Listener[CommandRan]):
    def listen(self, event: CommandRan, agents: ReadRows[AgentRow], git: ReadGit, elsewhere: ReadElsewhere) -> list[Fact]:
        if event.tool not in (SHELL, STEP) or event.stepped:
            return []
        folder = working_folder(agents.peek(event.agent), elsewhere)
        return [GitActionDone(agent=event.agent, label=label) for call in calls(event.command, event.output, folder, git) if (label := call.mark())]
