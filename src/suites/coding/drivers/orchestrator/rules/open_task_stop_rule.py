from suites.coding.support.coding_nudges import OPEN_TASKS_WAIT
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT


class OpenTaskStopRule(DriverRule):
    """Refuses an orchestrator stop while open tasks are available for delegation and worker capacity remains."""

    name = "coding.orchestrator-open-tasks-at-stop"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, settings: SettingValues, places: WorkerPlaces) -> None:
        self.places = places
        self.tasks, self.worktrees, self.settings = tasks, worktrees, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        open_worktrees = self.worktrees.open_worktrees()
        if not self.places.can_start_new():
            return RuleAnswer.allowed("no new worker can start")
        waiting = self.tasks.delegation_candidates([worktree.session_agent_id for worktree in open_worktrees])
        open_ids = [str(task.id) for task in waiting.oldest().page().rows]
        return RuleAnswer.refused(OPEN_TASKS_WAIT.nudge(tasks=', '.join(open_ids))) if open_ids else RuleAnswer.allowed("no open task waits for a worker")
