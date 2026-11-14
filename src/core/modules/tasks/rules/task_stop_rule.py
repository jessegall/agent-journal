from core.modules.tasks.support.task_nudges import STOP_TASK, STOP_TASKS
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.watched_runs import WatchedRuns
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from engine.enums.agent_role import AgentRole
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners


class TaskStopRule(DriverRule):
    """A stop with tasks in hand is refused, naming them all, unless the agent has a run going or its suite lets it
    stop. The agent may skip the refusal with a reason: it stays silent for it for 25 tool uses or 25 minutes."""

    name = "tasks.carry-on-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A stop with tasks in hand is refused, naming them all"
    skip_window = Interval(ToolUseSpan(25), Seconds(1500))
    skip_name = "tasks.carry-on-at-stop"

    def __init__(self, current_tasks: CurrentTasks, runs: WatchedRuns, assigners: SuiteTaskAssigners) -> None:
        self.current_tasks, self.runs, self.assigners = current_tasks, runs, assigners

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed("the agent has no task in hand")
        if self.runs.has_run(hook.agent_id):
            return RuleAnswer.allowed("the agent has a run going")
        assigner = self.assigners.assigner()
        if assigner is not None and assigner.allows_stop_with_tasks(hook.agent_id):
            return RuleAnswer.allowed("the suite lets the agent stop with its tasks in hand")
        started_tasks = self.current_tasks.started_tasks(hook.agent_id)
        if len(started_tasks) > 1:
            return RuleAnswer.refused(STOP_TASKS.nudge(tasks=", ".join(f"task:{task.id}" for task in started_tasks)))
        return RuleAnswer.refused(STOP_TASK.nudge(task=current.task.id))
