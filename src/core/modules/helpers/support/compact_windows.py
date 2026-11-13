from engine.agent.agent_checkouts import AgentCheckouts
from engine.enums.agent_role import AgentRole
from engine.enums.agent_setting import AgentSetting
from engine.listener.rows.event_rows import EventRows
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS
from core.modules.settings.bindings.support.context_share import ContextShare
from core.modules.tasks.queries.task_query import TaskQuery


class CompactWindows:
    """Sets the context size at which an agent's program compacts by itself, in the agent's own folder: the size
    set for the agent while it holds no started task, and the size at which it is compacted anyway while it
    holds one and may finish it first. An agent that shares the project folder with the main agent is left
    alone."""

    def __init__(self, settings: SettingValues, share: ContextShare, tasks: TaskQuery, rows: EventRows, checkouts: AgentCheckouts, providers: Providers) -> None:
        self.settings, self.share, self.tasks, self.rows = settings, share, tasks, rows
        self.checkouts, self.providers = checkouts, providers

    def write(self, agent_id: int) -> None:
        agent = self.rows.required(Agent, agent_id)
        if agent.ended_at is not None:
            return
        cap = self.share.cap(agent.role, agent.profile)
        if cap is None:
            return
        checkout = self.checkouts.checkout(agent_id)
        if not checkout.exists or (agent.role != AgentRole.MAIN and not checkout.checkout_type.is_separate_copy):
            return
        self.providers.provider(agent.program).change_agent_setting(checkout.root, AgentSetting.COMPACT_WINDOW, self.window(agent_id, cap))

    def window(self, agent_id: int, cap: int) -> int:
        hard = self.settings.number(CONTEXT_LIMIT_HARD_TOKENS)
        if hard > cap and self.settings.flag(CONTEXT_LIMIT_FINISH_TASK) and self.tasks.started_tasks(agent_id):
            return hard
        return cap
