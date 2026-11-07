from core.modules.tasks.support.task_nudges import STOP_TASK, STOP_TASKS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.watched_runs import WatchedRuns
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.base.agent_role import AgentRole


class TaskStopRule(DriverRule):
    """A stop with tasks in hand is refused, naming them all, unless the agent is waiting on a run it watches.
    """

    name = "tasks.carry-on-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks, runs: WatchedRuns) -> None:
        self.current_tasks, self.runs = current_tasks, runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed("the agent has no task in hand")
        if self.runs.is_watching(hook.agent_id):
            return RuleAnswer.allowed("the agent is watching a running command")
        started_tasks = self.current_tasks.started_tasks(hook.agent_id)
        if len(started_tasks) > 1:
            return RuleAnswer.refused(STOP_TASKS.nudge(tasks=", ".join(f"task:{task.id}" for task in started_tasks)))
        return RuleAnswer.refused(STOP_TASK.nudge(task=current.task.id))
