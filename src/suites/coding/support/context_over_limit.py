from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery


class ContextOverLimit:
    """Says how many tokens an agent's context holds once the context limit is on and that context has reached it,
    and whether the agent's next stop compacts it: it does unless it holds a task to finish first and is under the
    second limit."""

    def __init__(self, settings: SettingValues, agents: AgentRows, providers: Providers, home: JournalHome, tasks: TaskQuery) -> None:
        self.settings, self.agents, self.providers, self.home, self.tasks = settings, agents, providers, home, tasks

    def tokens(self, agent_id: int) -> int | None:
        if not self.settings.flag(CONTEXT_LIMIT_ON):
            return None
        agent = self.agents.find(agent_id)
        tokens = self.providers.provider(agent.program).context_tokens(self.home, agent.session)
        return tokens if tokens is not None and tokens >= self.settings.number(CONTEXT_LIMIT_TOKENS) else None

    def compacts_at_stop(self, agent_id: int) -> bool:
        tokens = self.tokens(agent_id)
        return tokens is not None and not self.waits_for_its_task(agent_id, tokens)

    def waits_for_its_task(self, agent_id: int, tokens: int) -> bool:
        hard = self.settings.number(CONTEXT_LIMIT_HARD_TOKENS)
        if hard and tokens >= hard:
            return False
        return self.settings.flag(CONTEXT_LIMIT_FINISH_TASK) and bool(self.tasks.started_tasks(agent_id))
