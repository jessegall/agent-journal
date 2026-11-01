from core.modules.tasks.support.task_nudges import TASK_AT_STOP
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.watched_runs import WatchedRuns
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.base.agent_role import AgentRole


class TaskStopRule(DriverRule):
    """A stop with a task in hand is refused and told to carry on, unless the agent is waiting on a run it watches."""

    name = "tasks.carry-on-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks, runs: WatchedRuns) -> None:
        self.current_tasks, self.runs = current_tasks, runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None or self.runs.is_watching(hook.agent_id):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(TASK_AT_STOP.nudge(name=current.name, task=current.task.id))
