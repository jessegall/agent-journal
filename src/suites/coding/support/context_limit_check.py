from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.base.provider.providers import Providers
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery

ASKED_AGAIN_SECONDS = 600


class ContextLimitCheck:
    """Says how many tokens an agent's context holds once the context limit is on and that context has reached
    it, and whether the agent's next stop compacts it: it does unless it holds a task to finish first and
    is under the second limit. An agent asked to compact at a context size is not asked again at that size until
    ten minutes have passed, whichever rule asks, since the size stays as it was until the compaction is read."""

    def __init__(self, settings: SettingValues, agents: AgentRows, providers: Providers, home: JournalHome, tasks: TaskQuery) -> None:
        self.settings, self.agents, self.providers, self.home, self.tasks = settings, agents, providers, home, tasks
        self.asked: dict[int, tuple[int | None, Timestamp]] = {}

    def was_asked(self, agent_id: int, now: Timestamp) -> bool:
        asked = self.asked.get(agent_id)
        return asked is not None and asked[0] == self.tokens(agent_id) and asked[1].elapsed_seconds(now) < ASKED_AGAIN_SECONDS

    def ask(self, agent_id: int, at: Timestamp) -> None:
        self.asked[agent_id] = (self.tokens(agent_id), at)

    def tokens(self, agent_id: int) -> int | None:
        if not self.settings.flag(CONTEXT_LIMIT_ENABLED):
            return None
        agent = self.agents.find(agent_id)
        tokens = self.providers.context_tokens(agent.program, self.home, agent.session)
        return tokens if tokens is not None and tokens >= self.settings.number(CONTEXT_LIMIT_TOKENS) else None

    def action(self) -> str:
        return self.settings.text(CONTEXT_LIMIT_ACTION)

    def exceeds_hard_limit(self, agent_id: int) -> bool:
        tokens, hard = self.tokens(agent_id), self.settings.number(CONTEXT_LIMIT_HARD_TOKENS)
        return tokens is not None and bool(hard) and tokens >= hard

    def needs_compaction(self, agent_id: int) -> bool:
        tokens = self.tokens(agent_id)
        return tokens is not None and not self.has_pending_task(agent_id, tokens)

    def has_pending_task(self, agent_id: int, tokens: int) -> bool:
        hard = self.settings.number(CONTEXT_LIMIT_HARD_TOKENS)
        if hard and tokens >= hard:
            return False
        return self.settings.flag(CONTEXT_LIMIT_FINISH_TASK) and bool(self.tasks.started_tasks(agent_id))
