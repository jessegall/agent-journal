from engine.time.timestamp import Timestamp
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.current_context_window import CurrentContextWindow
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from engine.setting.setting_values import SettingValues
from core.modules.tasks.queries.task_query import TaskQuery


class ContextLimitCheck:
    """Says how many tokens an agent's context holds once the context limit is on and that context has reached
    it on a reading written after its newest compaction, and whether the agent's next stop compacts it: it does unless it holds a task to finish first and
    is under the second limit. An agent asked to compact is not asked a second time for three minutes, whichever
    rule asks and whatever its context size is by then: the typed line can wait in the program until the agent
    pauses. After three minutes over the limit it is asked once more."""

    def __init__(self, settings: SettingValues, agents: AgentRows, current_window: CurrentContextWindow, tasks: TaskQuery, compactions: ContextCompactions) -> None:
        self.settings, self.agents, self.current_window, self.tasks = settings, agents, current_window, tasks
        self.compactions = compactions

    def is_compaction_requested(self, agent_id: int, timestamp: Timestamp) -> bool:
        return self.compactions.blocks_request(agent_id, timestamp)

    def tokens(self, agent_id: int) -> int | None:
        if not self.settings.flag(CONTEXT_LIMIT_ENABLED):
            return None
        tokens = self.current_window.window(self.agents.find(agent_id)).total_input_tokens
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
