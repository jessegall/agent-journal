from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_STOP_AFTER_TASK, CONTEXT_STOP_IMMEDIATE
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck

RETRY_SECONDS = Seconds(600)


class ContextStopNowRule(DriverRule):
    """An agent whose context has reached the token limit and that holds no task, or a worker just handed its next
    task, is told to stop, so that its stop compacts it."""

    name = "workers.context-limit-stop-now"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, hook_history: HookHistory, limit_check: ContextLimitCheck, tasks: TaskQuery, compaction: WorkerCompaction) -> None:
        self.hook_history, self.limit_check, self.tasks, self.compaction = hook_history, limit_check, tasks, compaction

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.compaction.is_after_task(hook.agent_id):
            return RuleAnswer.with_nudges(CONTEXT_STOP_AFTER_TASK.nudge())
        if self.limit_check.tokens(hook.agent_id) is None or self.tasks.started_tasks(hook.agent_id) or self.hook_history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_STOP_IMMEDIATE.nudge())
