from core.base.actor import Actor, ActorType
from core.base.command.bus import Bus
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.agent import Agent, AgentRole
from core.modules.agents.agent_start import AgentStart
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.hook_call_record import HookCallRecord
from core.modules.environments.environment import Environment


class AgentHookRoute(HookRoute):
    """Answers a hook as the agent that sent it: finds its open agent by session, or by the subagent the hook names,
    starts the main agent at its session's first hook and a subagent at its first, gives back the stored answer of
    a hook sent twice, and lets through, unkept, a hook from no agent it knows."""

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def answer(self, event: HookEvent) -> HookReply:
        earlier = self.queries.query(HookCall).filter(firing=event.firing).page(1, 1).rows
        if earlier:
            return HookReply.stored(earlier[0])
        agent = self.agent(event)
        if agent is None:
            return HookReply.allowed()
        return self.bus.run(HookCallRecord(event, agent.id), Actor(agent.id, ActorType.AGENT), environment_id=agent.environment_id)

    def agent(self, event: HookEvent) -> Agent | None:
        main = self.open_agent(event.session)
        if main is None and event.event == HookEventName.SESSION_START:
            main = self.started(event, event.session, AgentRole.MAIN, None)
        if main is None or not event.subagent:
            return main
        return self.open_agent(event.subagent) or self.started(event, event.subagent, AgentRole.SUBAGENT, main.id)

    def open_agent(self, session: str) -> Agent | None:
        rows = self.queries.query(Agent).filter(session=session).matching(IsNull("ended_at")).page(1, 1).rows
        return rows[0] if rows else None

    def started(self, event: HookEvent, session: str, role: AgentRole, parent_id: int | None) -> Agent | None:
        environments = self.queries.query(Environment).filter(name=event.environment).page(1, 1).rows
        if not environments:
            return None
        return self.bus.run(AgentStart(session, event.program, role, parent_id), Actor.core(), environment_id=environments[0].id)
