from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.driver.hook_event import HookEvent
from core.base.log_level import LogLevel
from core.base.request_values import RequestValues
from core.base.system_log_writer import SystemLogWriter
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.access_nudges import ENDED_AGENT, UNKNOWN_AGENT
from core.modules.drivers.support.hook_rule_answers import HookRuleAnswers
from core.modules.drivers.commands.record_hook_call.record_hook_call import RecordHookCall
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout import RecordHookTimeout
from core.modules.drivers.support.hook_durations import HookDurations
from core.modules.environments.models.environment import Environment
from core.modules.settings.bindings.support.setting_values import SettingValues


MAIN_HOOK_SECONDS = 5
AGENT_HOOK_SECONDS = 40
MILLISECONDS = 1000


class AgentHookRoute(HookRoute):
    """Answers a hook as the agent that sent it: finds its open agent by session, then by the
    launch name it was started under, saving the real session on it, starts the main agent at its
    session's first hook, gives back the stored answer of a hook sent twice, refuses the tools of a
    program whose agent has ended and asks the launcher to stop it, and lets through, without a
    record, a hook from an unknown agent when the event does not require an agent check."""

    def __init__(self, bus: Bus, queries: Queries, system_log: SystemLogWriter, durations: HookDurations, settings: SettingValues, agents: AgentRows, program: AgentProgram, rule_answers: HookRuleAnswers, request_values: RequestValues, clock: Clock) -> None:
        self.clock = clock
        self.rule_answers, self.request_values = rule_answers, request_values
        self.bus, self.queries, self.system_log, self.durations, self.settings = bus, queries, system_log, durations, settings
        self.agents, self.program = agents, program

    def answer(self, event: HookEvent) -> HookReply:
        self.durations.begin()
        with self.settings.keep_rows(), self.request_values.opened():
            return self.answered(event)

    def answered(self, event: HookEvent) -> HookReply:
        stored_call = self.queries.query(HookCall).filter(firing=event.firing).first()
        if stored_call is not None:
            return HookReply.stored(stored_call)
        agent = self.agent(event)
        if agent is None:
            return self.ended_agent_reply(event)
        actor = Actor(agent.id, ActorType.AGENT)
        with self.bus.scopes.command_scope((), actor, agent.environment_id):
            answers = self.rule_answers.evaluate(event, agent)
        reply = self.bus.run(RecordHookCall(event, agent.id, answers), actor, environment_id=agent.environment_id)
        self.note_timeout(event, agent, actor)
        with self.bus.scopes.read_scope((), None, agent.environment_id):
            measured = self.durations.measured(event, reply.labelled_lines or [*reply.lines, reply.refusal])
        return replace(reply, terminal="\n".join(line for line in (reply.terminal, measured) if line))

    def note_timeout(self, event: HookEvent, agent: Agent, actor: Actor) -> None:
        if event.event == HookEventName.TICK:
            return
        limit = MAIN_HOOK_SECONDS if agent.role == AgentRole.MAIN else AGENT_HOOK_SECONDS
        waited = self.clock.timestamp().value.timestamp() - event.hook_timestamp_ms / MILLISECONDS
        if waited >= limit:
            self.bus.run(RecordHookTimeout(agent.id), actor, environment_id=agent.environment_id)

    def ended_agent_reply(self, event: HookEvent) -> HookReply:
        row = self.ended_agent(event)
        if row is None and event.is_check_required:
            return HookReply(refusal=UNKNOWN_AGENT.nudge().text)
        if row is None or event.event != HookEventName.PRE_TOOL_USE:
            return HookReply.allowed()
        self.program.request_stop(row)
        return HookReply(refusal=ENDED_AGENT.nudge().text)

    def ended_agent(self, event: HookEvent) -> Agent | None:
        rows = (self.agents.session(event.session), self.agents.launch_row(event.launch) if event.launch else None)
        return next((row for row in rows if row is not None and row.ended_at is not None), None)

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
        agent = self.open_agent(event.launch) or self.cleared_agent(event)
        if agent is None:
            if self.agents.session(event.session) is None and self.ended_agent(event) is None:
                self.system_log.write(LogLevel.WARNING, f"a {event.program} session {event.session} came under launch name {event.launch}, which no open agent holds; let through")
            return None
        return self.bus.run(BindAgentSession(agent.id, event.session), Actor.core(), environment_id=agent.environment_id)

    def cleared_agent(self, event: HookEvent) -> Agent | None:
        if not event.is_clear_start:
            return None
        agent = self.agents.launch_row(event.launch)
        return agent if agent is not None and agent.ended_at is None else None

    def open_agent(self, session: str) -> Agent | None:
        agent = self.agents.session(session)
        return agent if agent is not None and agent.ended_at is None else None

    def started(self, event: HookEvent, role: str, parent_id: int | None) -> Agent | None:
        environment = self.queries.query(Environment).filter(name=event.environment).first()
        if environment is None:
            return None
        return self.bus.run(StartAgent(event.session, event.program, role, parent_id), Actor.core(), environment_id=environment.id)
