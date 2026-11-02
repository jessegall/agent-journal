from suites.coding.support.coding_nudges import OPEN_TASKS_WAIT
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import WORKER_LIMIT


class OpenTaskStopRule(DriverRule):
    """An orchestrator's stop is refused while tasks of its environment are open, naming them, since each
    waits for a worker it sends; at the worker limit it can send none, so it may stop until a worker ends."""

    name = "coding.orchestrator-open-tasks-at-stop"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, settings: SettingValues) -> None:
        self.tasks, self.worktrees, self.settings = tasks, worktrees, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if len(self.worktrees.environment_worktrees(hook.environment_id)) >= self.settings.number(WORKER_LIMIT, hook.environment_id):
            return RuleAnswer.allowed()
        open_ids = [str(task.id) for task in self.tasks.open_tasks(hook.environment_id).oldest().page().rows]
        return RuleAnswer.refused(OPEN_TASKS_WAIT.nudge(tasks=', '.join(open_ids))) if open_ids else RuleAnswer.allowed()
