from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED, CONTEXT_STOP_NOW
from suites.coding.support.coding_agent_role import CodingAgentRole
from suites.coding.support.context_over_limit import ContextOverLimit

RETRY_SECONDS = Seconds(600)


class ContextLimitRule(DriverRule):
    """A stop compacts an agent at once when its context has reached the token limit, unless it holds a task it is to
    finish first and has not reached the second limit."""

    name = "workers.context-limit"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [CodingAgentRole.MAIN, CodingAgentRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, history: HookHistory, over_limit: ContextOverLimit) -> None:
        self.history, self.over_limit = history, over_limit

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.over_limit.compacts_at_stop(hook.agent_id) or self.history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_COMPACTED.nudge()).running(ChooseAgentControl(hook.agent_id, "context", "compact"))


class ContextLimitStopNowRule(DriverRule):
    """An agent whose context has reached the token limit and that holds no task is told to stop, so that its stop
    compacts it."""

    name = "workers.context-limit-stop-now"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [CodingAgentRole.MAIN, CodingAgentRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, history: HookHistory, over_limit: ContextOverLimit, tasks: TaskQuery) -> None:
        self.history, self.over_limit, self.tasks = history, over_limit, tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.over_limit.tokens(hook.agent_id) is None or self.tasks.started_tasks(hook.agent_id) or self.history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_STOP_NOW.nudge())

