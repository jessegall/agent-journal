from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_STOP_BETWEEN_TASKS, CONTEXT_STOP_NOW
from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.agent_role import AgentRole
from suites.coding.support.context_over_limit import ContextOverLimit
from suites.coding.modules.workers.rules.context_limit_rule import RETRY_SECONDS


class ContextLimitStopNowRule(DriverRule):
    """An agent whose context has reached the token limit and that holds no task, or a worker just handed its next
    task, is told to stop, so that its stop compacts it."""

    name = "workers.context-limit-stop-now"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperKind.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, history: HookHistory, over_limit: ContextOverLimit, tasks: TaskQuery, compaction: WorkerCompaction) -> None:
        self.history, self.over_limit, self.tasks, self.compaction = history, over_limit, tasks, compaction

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.compaction.is_between_tasks(hook.agent_id):
            return RuleAnswer.with_nudges(CONTEXT_STOP_BETWEEN_TASKS.nudge())
        if self.over_limit.tokens(hook.agent_id) is None or self.tasks.started_tasks(hook.agent_id) or self.history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_STOP_NOW.nudge())
