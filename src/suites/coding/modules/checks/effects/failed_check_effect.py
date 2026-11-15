from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.checks.commands.report_check.report_check import ReportCheck
from suites.coding.modules.checks.lines.failed_check_lines import FAILED_CHECK_RULE
from suites.coding.modules.checks.support.unreported_checks import UnreportedChecks


class FailedCheckEffect(EventEffect):
    """Records each failing check the main agent is told of, so it is told again only after an hour."""

    key = FAILED_CHECK_RULE
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, checks: UnreportedChecks) -> None:
        self.checks = checks

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [ReportCheck(check.id) for check in self.checks.failing()]
