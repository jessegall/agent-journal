from engine.events.agents import AgentReported
from engine.events.engine import CommandRan
from expects import Given, Unchanged
from features.base import Feature
from features.git_actions.details import GitActionsDetails
from features.git_actions.handlers import MarkBranchSwitches, MarkGitActions
from features.journal import Journal
from resources.types import AgentRow


AGENT_ROW = AgentRow(n=1, title="claude-1")


def ran(command: str, output: str = "") -> CommandRan:
    return CommandRan(agent=1, tool="Bash", command=command, output=output)


class GitActions(Feature):
    details = GitActionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(MarkBranchSwitches(), expects=[
            Given(AgentReported(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(MarkGitActions(), expects=[
            Given(ran("git status"), rows=[AGENT_ROW]) >> Unchanged(),
            Given(ran('git commit -m "Fix the crash"'), rows=[AGENT_ROW]) >> Unchanged(),
            Given(ran("git push origin main", "fatal: could not read from remote repository"), rows=[AGENT_ROW]) >> Unchanged(),
            Given(ran("git pull", "Already up to date."), rows=[AGENT_ROW]) >> Unchanged(),
            Given(ran("ls -la"), rows=[AGENT_ROW]) >> Unchanged(),
        ])
