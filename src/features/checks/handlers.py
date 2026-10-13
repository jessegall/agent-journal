from events import Fact
from events.agents import ClockTicked
from events.checks import CheckDue, CheckFailed, CheckPassedAgain, TestsFinished, TestsRunning
from receiving import Handler
from resources.base import USER
from resources.checks import Check
from resources.types import AgentRow, Notification
from serving import Chat, Rows


def mark(agents: Rows[AgentRow], about: str, label: str, **card) -> None:
    """Shows the check's state in the chat on your side, addressed to the agent, and opening the check."""
    row = agents.primary()
    if row:
        agents.card(row.n, label=label, icon="check", side=USER, row=about, **card)


class ForgetDeadRuns(Handler[ClockTicked]):
    def handle(self, event: ClockTicked, checks: Rows[Check]) -> list[Fact]:
        checks.forget_dead_runs()
        return []


class StartDueCheck(Handler[CheckDue]):
    def handle(self, event: CheckDue, checks: Rows[Check]) -> list[Fact]:
        checks.begin(event.check)
        return []


class SettlePassingCheck(Handler[CheckPassedAgain]):
    def handle(self, event: CheckPassedAgain, notifications: Rows[Notification], agents: Rows[AgentRow]) -> list[Fact]:
        notifications.complete(event.notification, how="the check passes again")
        mark(agents, event.about, f"Check {event.check} passes again", tone="good", key=f"check:{event.check}:cleared:{event.notification}")
        return []


class FileFailingCheck(Handler[CheckFailed]):
    def handle(self, event: CheckFailed, notifications: Rows[Notification], agents: Rows[AgentRow], chat: Chat) -> list[Fact]:
        for stale in event.stale:
            notifications.complete(stale, how="the check reports something else now")
        chat.notify("failing", title=event.title, output=event.output, about=event.about, reported=event.reported)
        mark(agents, event.about, f"Check {event.check} failed:", name=event.headline, tone="danger", key=f"check:{event.check}:{event.reported}")
        chat.say("failed", title=event.title, n=event.check)
        return []


class ShowTestsRunning(Handler[TestsRunning]):
    def handle(self, event: TestsRunning, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, key=event.key, label="Running tests", icon="check", name=event.name, command=event.command, title=event.title,
                    state="running", started=event.started)
        return []


class ShowTestsFinished(Handler[TestsFinished]):
    def handle(self, event: TestsFinished, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, key=event.key, label=event.label, icon="check", name=event.name, command=event.command, title=event.title,
                    state=event.state, started=event.started, ended=event.ended, detail=event.detail)
        return []
