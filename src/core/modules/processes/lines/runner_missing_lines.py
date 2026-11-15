from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.needs.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.nudges.runner_missing_nudge import RunnerMissingNudge
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_plan import RUNNER_REWRITE_KEY, RunnerPlan


class RunnerMissingLines(EventLineSource):
    """An agent whose shell lines run as written, because the runner is not installed, is told so once."""

    key = RUNNER_REWRITE_KEY
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, plan: RunnerPlan, runner: RunnerBinary, history: LineHistory) -> None:
        self.plan, self.runner, self.history = plan, runner, history

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        if event is None or not self.plan.of_event(event, agent_id).runner_missing or self.history.last_spoke(self.key, agent_id) is not None:
            return []
        return [RunnerMissingNudge.declared().nudge(folder=self.runner.path.parent)]
