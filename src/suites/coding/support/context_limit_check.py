from engine.provider.providers import Providers
from engine.time.timestamp import Timestamp
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.current_context_window import CurrentContextWindow
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_GROWTH_PERCENT, CONTEXT_LIMIT_HARD_TOKENS
from core.modules.settings.bindings.support.context_share import ContextShare
from engine.setting.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery


class ContextLimitCheck:
    """Says how many tokens an agent's context holds once the context limit is on and the agent's own size,
    read from ContextShare, makes a compaction due, on a reading written after its newest compaction, and
    whether the agent's next stop compacts it: it does unless it holds a task to finish first and is under the
    second limit. Whether a size is due is asked of the compactions, never compared here. An agent asked to
    compact is not asked a second time for three minutes, whichever rule asks: the typed line can wait in the
    program until the agent pauses."""

    def __init__(self, settings: SettingValues, agents: AgentRows, current_window: CurrentContextWindow, tasks: TaskQuery, compactions: ContextCompactions, share: ContextShare, providers: Providers) -> None:
        self.settings, self.agents, self.current_window, self.tasks = settings, agents, current_window, tasks
        self.compactions, self.share, self.providers = compactions, share, providers

    def has_windowed_compaction(self, agent_id: int) -> bool:
        return self.providers.provider(self.agents.find(agent_id).program).compacts_by_window

    def is_compaction_requested(self, agent_id: int, timestamp: Timestamp) -> bool:
        return self.compactions.blocks_request(agent_id, timestamp)

    def is_compaction_unfinished(self, agent_id: int, timestamp: Timestamp) -> bool:
        return self.compactions.open_compaction(agent_id) is not None or self.is_compaction_requested(agent_id, timestamp)

    def tokens(self, agent_id: int) -> int | None:
        agent = self.agents.find(agent_id)
        cap = self.share.cap(agent.role, agent.profile)
        if cap is None:
            return None
        tokens = self.current_window.window(agent).total_input_tokens
        if tokens is None:
            return None
        return tokens if self.compactions.requires_compaction(agent_id, tokens, cap, self.settings.number(CONTEXT_LIMIT_GROWTH_PERCENT)) else None

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
