from events.agents import ToolFinished
from events.pull_requests import PullRequestEnded, PullRequestOpened
from expects import Dispatches, Given, Updated, Wrote, nothing
from features.pull_requests.details import PullRequestsDetails
from features.pull_requests.handlers import PinThePullRequest, TakeThePinAway
from features.pull_requests.listeners import SpotPullRequest
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow, Notice

LINK = "https://github.com/acme/app/pull/42"
FINISHED = ToolFinished(agent=1)


def after(command: str, **result: str) -> AgentRow:
    return AgentRow(n=1, title="claude-1", data={"commands": [{"command": command, "tool": "Bash", "at": 100.0, "done": 101.0, "result": result}]})


def pinned(pull: str = "42", n: int = 2) -> Notice:
    return Notice(n=n, title=f"Pull request {pull} is open", data={"pull": pull, "link": LINK})


class PullRequests(Feature):
    details = PullRequestsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ToolFinished, SpotPullRequest(), expects=[
            Given(FINISHED, rows=[after("gh pr create", pull="create", url=LINK, number="42")])
                >> Dispatches(PullRequestOpened(agent=1, number="42", url=LINK).once("1|pull 100.0")),
            Given(FINISHED, rows=[after("gh pr merge 42", pull="merge", number="42"), pinned()])
                >> Dispatches(PullRequestEnded(agent=1, notice=2, how="pull request merged").once("1|pull 100.0|2")),
            Given(FINISHED, rows=[after("gh pr close 7", pull="close", number="7"), pinned("42", 2), pinned("7", 3)])
                >> Dispatches(PullRequestEnded(agent=1, notice=3, how="pull request closed").once("1|pull 100.0|3")),
            Given(FINISHED, rows=[after("gh pr merge", pull="merge"), pinned("42", 2), pinned("7", 3)])
                >> Dispatches(PullRequestEnded(agent=1, notice=2, how="pull request merged").once("1|pull 100.0|2")) & Dispatches(PullRequestEnded(agent=1, notice=3, how="pull request merged").once("1|pull 100.0|3")),
            Given(FINISHED, rows=[after("gh pr merge 42", pull="merge", number="42"), Notice(n=2, title="Waiting for permission", data={"action": "permission"})]) >> Dispatches(nothing),
            Given(FINISHED, rows=[after("npm test", ok=True)]) >> Dispatches(nothing),
            Given(FINISHED, rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(PullRequestOpened, PinThePullRequest(), expects=[
            Given(PullRequestOpened(agent=1, number="42", url=LINK), rows=[AgentRow(n=1, title="claude-1")])
                >> Wrote(Notice(title="Pull request 42 is open", data={"link": LINK, "pull": "42", "label": "Open the pull request", "tone": "note"})),
        ])
        journal.events.handle(PullRequestEnded, TakeThePinAway(), expects=[
            Given(PullRequestEnded(agent=1, notice=2, how="pull request merged"), rows=[pinned()]) >> Updated(Notice(n=2), outcome="pull request merged"),
        ])
