from core.base.refusal import Refusal
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.hook_event import HookEvent
from core.base.error_log import ErrorLog
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.access_nudges import ENDED_HELPER
from core.modules.drivers.commands.record_hook_call.record_hook_call import RecordHookCall
from core.modules.drivers.support.hook_durations import HookDurations
from core.modules.environments.models.environment import Environment
from core.modules.settings.bindings.support.setting_values import SettingValues


class AgentHookRoute(HookRoute):
    """Answers a hook as the agent that sent it: finds its open agent by session, then by the
    launch name it was started under, saving the real session on it, starts the main agent at its
    session's first hook, gives back the stored answer of a hook sent twice, and lets through,
    without a record, a hook from an agent it does not know."""

    def __init__(self, bus: Bus, queries: Queries, errors: ErrorLog, durations: HookDurations, settings: SettingValues, agents: AgentRows) -> None:
        self.bus, self.queries, self.errors, self.durations, self.settings = bus, queries, errors, durations, settings
        self.agents = agents

    def answer(self, event: HookEvent) -> HookReply:
        self.durations.begin()
        with self.settings.keep_rows():
            return self.answered(event)

    def answered(self, event: HookEvent) -> HookReply:
        stored_calls = self.queries.query(HookCall).filter(firing=event.firing).limited(1)
        if stored_calls:
            return HookReply.stored(stored_calls[0])
        agent = self.agent(event)
        if agent is None:
            return self.ended_helper_reply(event)
        reply = self.bus.run(RecordHookCall(event, agent.id), Actor(agent.id, ActorType.AGENT), environment_id=agent.environment_id)
        with self.bus.scopes.read_scope((), None, agent.environment_id):
            measured = self.durations.measured(event, reply.labelled_lines or [*reply.lines, reply.refusal])
        return replace(reply, terminal="\n".join(line for line in (reply.terminal, measured) if line))

    def ended_helper_reply(self, event: HookEvent) -> HookReply:
        row = self.agents.session(event.session)
        if row is None or row.role != AgentRole.HELPER or event.event != HookEventName.PRE_TOOL_USE:
            return HookReply.allowed()
        return HookReply(refusal=ENDED_HELPER.nudge().text)

    def agent(self, event: HookEvent) -> Agent | None:
        main = self.open_agent(event.session) or self.launch_name_agent(event)
        if main is None and event.event == HookEventName.SESSION_START:
            main = self.session_agent(event)
        return main

    def session_agent(self, event: HookEvent) -> Agent | None:
        ended = self.agents.session(event.session)
        if ended is not None:
            return self.started(event, ended.role, ended.parent_id)
        return None if event.launch else self.started(event, AgentRole.MAIN, None)

    def launch_name_agent(self, event: HookEvent) -> Agent | None:
        if not event.launch:
            return None
        agent = self.open_agent(event.launch)
        if agent is None:
            if self.agents.session(event.session) is not None:
                return None
            self.errors.noted(f"a {event.program} session {event.session} came under launch name {event.launch}, which no open agent holds; let through")
            return None
        return self.bus.run(BindAgentSession(agent.id, event.session), Actor.core(), environment_id=agent.environment_id)

    def open_agent(self, session: str) -> Agent | None:
        agent = self.agents.session(session)
        return agent if agent is not None and agent.ended_at is None else None

    def started(self, event: HookEvent, role: str, parent_id: int | None) -> Agent | None:
        environments = self.queries.query(Environment).filter(name=event.environment).limited(1)
        if not environments:
            return None
        if role == AgentRole.MAIN:
            self.end_running_main_agents(environments[0].id)
        return self.bus.run(StartAgent(event.session, event.program, role, parent_id), Actor.core(), environment_id=environments[0].id)

    def end_running_main_agents(self, environment_id: int) -> None:
        with self.bus.scopes.read_scope((), None, environment_id):
            main_agents = MainAgentFinder.all_running(self.queries)
        for main in main_agents:
            try:
                self.bus.run(StopAgent(main.id), Actor.core(), environment_id=environment_id)
            except Refusal:
                self.bus.run(EndAgent(row_id=main.id), Actor.core(), environment_id=environment_id)
