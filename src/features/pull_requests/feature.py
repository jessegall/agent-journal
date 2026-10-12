from events.agents import ToolFinished
from expects import Given, Unchanged
from features.base import Feature
from features.journal import Journal
from features.pull_requests.details import PullRequestsDetails
from features.pull_requests.handlers import PinPullRequests
from resources.types import AgentRow


def ran(command: str, **found) -> AgentRow:
    return AgentRow(n=1, title="claude-1", data={"commands": [{"command": command, "tool": "Bash", "at": 5.0, "done": 6.0, **found}]})


class PullRequests(Feature):
    details = PullRequestsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PinPullRequests(), expects=[
            Given(ToolFinished(agent=1), rows=[ran("git status")]) >> Unchanged(),
            Given(ToolFinished(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(ToolFinished(agent=1), rows=[ran("gh pr merge 12", result={"pull": "merge", "number": "12"})]) >> Unchanged(),
        ])
