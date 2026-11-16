from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.states.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.agent_messages.runner_missing_message import RunnerMissingMessage
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_plan import RUNNER_REWRITE_KEY, RunnerPlan


class RunnerMissingLines(EventLineSource):
    """An agent whose shell lines run as written, because the runner is not installed, is told so once."""

    key = RUNNER_REWRITE_KEY
    reads_line_history = True
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, plan: RunnerPlan, runner: RunnerBinary, history: LineHistory) -> None:
        self.plan, self.runner, self.history = plan, runner, history

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if event is None or not self.plan.event_decision(event, agent_id).runner_missing or self.history.last_given(self.key, agent_id) is not None:
            return []
        return [RunnerMissingMessage.declared().agent_message(folder=self.runner.path.parent)]
