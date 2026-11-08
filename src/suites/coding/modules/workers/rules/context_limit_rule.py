from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED
from suites.coding.support.coding_agent_role import CodingAgentRole

RETRY_SECONDS = Seconds(600)


class ContextLimitRule(DriverRule):
    """A tick compacts an agent between its turns once its context has passed the token limit, first letting it finish
    the task in hand when that is switched on, unless it has also passed the second limit."""

    name = "workers.context-limit"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [CodingAgentRole.MAIN, CodingAgentRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, settings: SettingValues, history: HookHistory, agents: AgentRows, providers: Providers, home: JournalHome, hook_calls: HookCallQuery, tasks: TaskQuery) -> None:
        self.settings, self.history, self.agents, self.providers, self.home, self.hook_calls, self.tasks = settings, history, agents, providers, home, hook_calls, tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        limit = self.settings.number(CONTEXT_LIMIT_TOKENS)
        if not self.settings.flag(CONTEXT_LIMIT_ON) or self.history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        agent = self.agents.find(hook.agent_id)
        tokens = self.providers.provider(agent.program).context_tokens(self.home, agent.session)
        if tokens is None or tokens < limit or not self.hook_calls.is_idle(agent.id, hook.timestamp) or self.waits_for_its_task(agent, tokens):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_COMPACTED.nudge(tokens=tokens)).running(ChooseAgentControl(agent.id, "context", "compact"))

    def waits_for_its_task(self, agent: Agent, tokens: int) -> bool:
        hard = self.settings.number(CONTEXT_LIMIT_HARD_TOKENS)
        if hard and tokens >= hard:
            return False
        return self.settings.flag(CONTEXT_LIMIT_FINISH_TASK) and bool(self.tasks.started_tasks(agent.id))
