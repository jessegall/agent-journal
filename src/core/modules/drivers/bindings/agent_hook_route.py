from engine.time.timestamp import MILLISECONDS
from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.driver.hook_event import HookEvent
from engine.process.door.request_records import REFUSED_HOOK_EXIT_CODE, RequestRecords
from engine.enums.log_level import LogLevel
from engine.request.request_values import RequestValues
from engine.log.system_log_writer import SystemLogWriter
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_reply import HookReply
from engine.driver.hook_route import HookRoute
from engine.driver.lockdown import Lockdown
from engine.driver.program_lockdown import ProgramLockdown
from core.modules.agents.commands.halt_agent.halt_agent import HaltAgent
from core.modules.drivers.rules.panic_file_rule import PanicFileRule
from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from engine.enums.agent_role import AgentRole
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.drivers.support.access_nudges import ENDED_AGENT, REPLACED_SESSION, UNKNOWN_AGENT
from core.modules.drivers.support.hook_rule_answers import HookRuleAnswers
from core.modules.drivers.commands.record_hook_call.record_hook_call import RecordHookCall
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout import RecordHookTimeout
from core.modules.drivers.support.hook_durations import HookDurations
from core.modules.environments.models.environment import Environment
from engine.setting.setting_values import SettingValues


MAIN_HOOK_SECONDS = 5
AGENT_HOOK_SECONDS = 40


def hook_row_line(event: HookEvent) -> str:
    return f"{event.program} {event.event.value}"


class AgentHookRoute(HookRoute):
    """Stops every hook but a session end of a program that is locked down at a usage limit, before anything
    else: no agent is looked up or started, no rule is asked and no hook call is recorded. Otherwise answers a
    hook as the agent that sent it: finds its open agent by session, then by the launch name it
    was started under, saving the real session on it when it is a main agent or runs a program that does not
    take a session from the journal, starts the main agent at its session's first hook, gives back the stored
    answer of a hook sent twice, refuses the tools of a program whose agent has ended and asks the launcher to
    stop it, refuses the tools of a session its agent replaced with a newer one, which never starts an agent
    and never takes its agent back, and lets through, without a record, a hook from an unknown agent when the
    event does not require an agent check. The row of a recorded hook is kept once its call is committed; a tick
    that brought nothing keeps none."""

    def __init__(self, bus: Bus, queries: Queries, system_log: SystemLogWriter, durations: HookDurations, settings: SettingValues, agents: AgentRows, program: AgentProgram, rule_answers: HookRuleAnswers, request_values: RequestValues, clock: Clock, providers: Providers, lockdown: ProgramLockdown, sessions: AgentSessions, request_records: RequestRecords) -> None:
        self.lockdown, self.sessions, self.request_records = lockdown, sessions, request_records
        self.clock, self.providers = clock, providers
        self.rule_answers, self.request_values = rule_answers, request_values
        self.bus, self.queries, self.system_log, self.durations, self.settings = bus, queries, system_log, durations, settings
        self.agents, self.program = agents, program

    def answer(self, event: HookEvent) -> HookReply:
        self.durations.begin()
        with self.settings.keep_rows(), self.request_values.opened():
            return self.answered(event)

    def answered(self, event: HookEvent) -> HookReply:
        lockdown = self.lockdown.lockdown(event.program)
        if lockdown.stops(event.event) and not self.passes_lockdown(event):
            return self.halted(event, lockdown)
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
        if reply.hook_call_id is not None:
            self.request_records.recorded_hook(agent.id, agent.environment_id, hook_row_line(event), REFUSED_HOOK_EXIT_CODE if reply.refusal else 0)
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
        if row is None:
            return self.agentless_reply(event)
        if event.event != HookEventName.PRE_TOOL_USE:
            return HookReply.allowed()
        self.program.request_stop(row)
        return HookReply(refusal=ENDED_AGENT.nudge().text)

    def agentless_reply(self, event: HookEvent) -> HookReply:
        replaced_agent_id = self.sessions.replaced_agent_id(event.session)
        if replaced_agent_id is not None and event.event == HookEventName.PRE_TOOL_USE:
            return HookReply(refusal=REPLACED_SESSION.nudge(agent=self.agents.find_unscoped(replaced_agent_id).number).text)
        if replaced_agent_id is None and event.is_check_required:
            return HookReply(refusal=UNKNOWN_AGENT.nudge().text)
        return HookReply.allowed()

    def passes_lockdown(self, event: HookEvent) -> bool:
        agent = self.open_agent(event.session)
        if agent is None or agent.role != AgentRole.MAIN:
            return False
        return event.event is HookEventName.PROMPT or (event.event is HookEventName.PRE_TOOL_USE and PanicFileRule.is_panic_file_line(event))

    def halted(self, event: HookEvent, lockdown: Lockdown) -> HookReply:
        agent = self.open_agent(event.session) or self.launch_name_agent(event)
        if agent is not None and agent.halted_at is None:
            self.bus.run(HaltAgent(agent.id), Actor.core(), environment_id=agent.environment_id)
        return HookReply.halted(lockdown.stop_line)

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
        if event.launch or (event.is_continuing and self.sessions.replaced_agent_id(event.session) is not None):
            return None
        return self.started(event, AgentRole.MAIN, None)

    def launch_name_agent(self, event: HookEvent) -> Agent | None:
        if not event.launch:
            return None
        agent = self.open_agent(event.launch) or self.cleared_agent(event)
        if agent is None:
            if self.agents.session(event.session) is None and self.ended_agent(event) is None:
                self.system_log.write(LogLevel.WARNING, f"a {event.program} session {event.session} came under launch name {event.launch}, which no open agent holds; let through")
            return None
        if agent.role != AgentRole.MAIN and self.providers.provider(agent.program).is_session_chosen():
            self.system_log.write(LogLevel.WARNING, f"a {event.program} session {event.session} came under launch name {event.launch}, whose {agent.role} {agent.id} holds session {agent.session}; let through")
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
        return self.bus.run(StartAgent(event.session, event.program, role, parent_id, is_announced=True), Actor.core(), environment_id=environment.id)
