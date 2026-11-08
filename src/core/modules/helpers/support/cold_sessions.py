from core.modules.settings.support.context_share import ContextShare
from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.agents.commands.renew_agent_session.renew_agent_session import RenewAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT, COLD_SESSION_MINUTES, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.modules.settings.bindings.support.setting_values import SettingValues

SECONDS_PER_MINUTE = 60


class ColdSessions:
    """Says whether resuming an agent would be wasteful: its prompt cache has gone cold because it has not replied for
    longer than the cache lasts, and its context is large enough that writing it to the cache again costs more than
    starting over; such an agent gets a new program session under the same journal agent, which keeps its number,
    memories, tasks and worktree. A limit of 0 turns the check off. An agent past the context limit starts over the same way."""

    def __init__(self, queries: Queries, clock: Clock, providers: Providers, home: JournalHome, settings: SettingValues, bus: Bus, share: ContextShare) -> None:
        self.queries, self.clock, self.providers, self.home, self.settings, self.bus, self.share = queries, clock, providers, home, settings, bus, share

    def renewed(self, agent: Agent) -> Agent:
        if not self.is_cold(agent) and not self.is_past_context_limit(agent):
            return agent
        return self.bus.run(RenewAgentSession(agent.id), Actor.core(), environment_id=agent.environment_id)

    def is_past_context_limit(self, agent: Agent) -> bool:
        limit = self.settings.number(CONTEXT_LIMIT_TOKENS)
        return self.settings.flag(CONTEXT_LIMIT_ON) and (self.providers.provider(agent.program).context_tokens(self.home, agent.session) or 0) >= limit

    def is_cold(self, agent: Agent) -> bool:
        minutes, percent = self.settings.number(COLD_SESSION_MINUTES), self.settings.number(COLD_SESSION_CONTEXT_PERCENT)
        if not minutes or not percent:
            return False
        activity = self.queries.query(AgentActivity).find(agent.id)
        if not activity.is_inactive(self.clock.timestamp(), minutes * SECONDS_PER_MINUTE):
            return False
        return (self.share.percent(agent.program, agent.session) or 0) >= percent
