from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.wake_cause import WakeCause
from engine.enums.agent_role import AgentRole
from suites.coding.modules.checks.support.unreported_checks import UnreportedChecks


class CheckFailedWake(WakeCause):
    """A check failed and the main agent has not been told: the resting main agent is given a turn, in which the
    line about the check reaches it, so a failing check never waits for the person's next message."""

    key = "checks.check-failed"

    def __init__(self, checks: UnreportedChecks) -> None:
        self.checks = checks

    def requires_wake(self, view: AgentView) -> bool:
        return view.agent.agent_type == AgentRole.MAIN.value and bool(self.checks.failing())

    def text(self, view: AgentView) -> str:
        return "A check failed: read what it printed"
