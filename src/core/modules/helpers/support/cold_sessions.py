from core.modules.processes.support.output_check_schedule import MINUTE_SECONDS
from core.modules.settings.support.context_share import ContextShare
from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.journal_home import JournalHome
from core.base.listener.event_rows import EventRows
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT, COLD_SESSION_MINUTES, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from core.modules.helpers.support.stale_session_error import StaleSessionError
from core.modules.settings.bindings.support.setting_values import SettingValues

STALE_SESSION_SECONDS = 3600


class ColdSessions:
    """Says whether resuming an agent would be wasteful: its prompt cache has gone cold because it has not
    replied for longer than the cache lasts, and its context is large enough that writing it to the cache
    again costs more than starting over; such an agent gets a new program session under the same journal
    agent, which keeps its number, memories, tasks and worktree. A limit of 0 turns the check off. An agent
    past the context limit starts over the same way."""

    def __init__(self, queries: Queries, clock: Clock, providers: Providers, home: JournalHome, settings: SettingValues, bus: Bus, share: ContextShare, rows: EventRows) -> None:
        self.queries, self.clock, self.providers, self.home, self.settings, self.bus, self.share, self.rows = queries, clock, providers, home, settings, bus, share, rows

    def replaced(self, agent: Agent) -> Agent:
        if not self.is_cold(agent) and not self.exceeds_context_limit(agent):
            return agent
        return self.bus.run(ReplaceAgentSession(agent.id), Actor.core(), environment_id=agent.environment_id)

    def replaced_silent(self, agent: Agent) -> Agent:
        if not self.is_silent(agent) and not self.exceeds_context_limit(agent):
            return agent
        return self.bus.run(ReplaceAgentSession(agent.id), Actor.core(), environment_id=agent.environment_id)

    def is_silent(self, agent: Agent) -> bool:
        activity = self.rows.required(AgentActivity, agent.id)
        return activity.is_inactive(self.clock.timestamp(), STALE_SESSION_SECONDS) or self.is_cold_with_activity(agent, activity)

    def require_replaced(self, agent: Agent) -> None:
        activity = self.rows.required(AgentActivity, agent.id)
        if activity.is_inactive(self.clock.timestamp(), STALE_SESSION_SECONDS):
            raise StaleSessionError(f"agent {agent.id} was about to resume session {agent.session}, whose last message is more than an hour old")

    def exceeds_context_limit(self, agent: Agent) -> bool:
        limit = self.settings.number(CONTEXT_LIMIT_TOKENS)
        return self.settings.flag(CONTEXT_LIMIT_ENABLED) and (self.providers.provider(agent.program).context_tokens(self.home, agent.session) or 0) >= limit

    def is_cold(self, agent: Agent) -> bool:
        return self.is_cold_with_activity(agent, self.queries.query(AgentActivity).find(agent.id))

    def is_cold_with_activity(self, agent: Agent, activity: AgentActivity) -> bool:
        minutes, percent = self.settings.number(COLD_SESSION_MINUTES), self.settings.number(COLD_SESSION_CONTEXT_PERCENT)
        if not minutes or not percent:
            return False
        if not activity.is_inactive(self.clock.timestamp(), minutes * MINUTE_SECONDS):
            return False
        return (self.share.percent(agent.program, agent.session) or 0) >= percent
