from resources.command_runs import command_runs
from events import Fact
from events.agents import ToolFinished
from events.pull_requests import PullRequestEnded, PullRequestOpened
from receiving import Listener
from resources.types import AgentRow, Notice
from serving import ReadRows

OPENED = "create"


class SpotPullRequest(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, agents: ReadRows[AgentRow], notices: ReadRows[Notice]) -> list[Fact]:
        ran = next((c for c in reversed(command_runs(agents.peek(event.agent))) if c.done), None)
        pull = ran.result if ran else None
        if not pull or not pull.pull:
            return []
        claim = f"{event.agent}|pull {ran.at}"
        if pull.pull == OPENED:
            return [PullRequestOpened(agent=event.agent, number=pull.number, url=pull.url).once(claim)] if pull.url else []
        return [PullRequestEnded(agent=event.agent, notice=notice.n, how=f"pull request {pull.pull}d").once(f"{claim}|{notice.n}")
                for notice in notices.rows.standing() if notice.data.get("pull") and (not pull.number or notice.data.get("pull") == pull.number)]
