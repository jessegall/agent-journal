from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.checks.agent_messages.check_failed_message import CheckFailedMessage
from suites.coding.modules.checks.support.unreported_checks import UnreportedChecks

FAILED_CHECK_RULE = "checks.failed"


class FailedCheckLines(EventLineSource):
    """The main agent is told once that a check fails, also while it waits, with the last 800 characters it
    printed, and again after an hour if it still fails."""

    key = FAILED_CHECK_RULE
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, checks: UnreportedChecks) -> None:
        self.checks = checks

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return [CheckFailedMessage.declared().agent_message(check=check.id) for check in self.checks.failing()]
