from dataclasses import replace
from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.process.leftover_process import LeftoverProcess
from engine.provider.launch_command import LaunchCommand
from engine.provider.providers import Providers
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.models.enums.standing_state import StandingState
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.models.enums.stopped import Stopped
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.agents.support.program_transport import ProgramTransport
from core.modules.agents.support.program_exit import ProgramExit
from core.modules.agents.support.program_process import ProgramProcess
from core.modules.agents.support.standing import Standing
from core.modules.environments.support.environment_rows import EnvironmentRows

RECENT_END_SECONDS = 600
OPENED_ROW_TEXT = "was ended while its program runs: its row is open again"
ENDED_ROW_TEXT = "was open while no program of it runs: its row has ended"
FINISHED_REASON = "its program ended"
LAUNCHER_PROGRAM_TEXT = "has no recorded process any more, but the launcher has its program: its row stays open"
DEFERRED_END_TEXT = "said its session ended while the launcher still has its program: its row ends when the program has gone"


class AgentDispatcher:
    """Owns the life of an agent's program: it starts it, says whether it runs, and ends it, and it is the
    one place that writes the end of an agent's row. The standing is worked out from the launcher, the
    recorded process of an open row and the row, each read once. A stop leaves a program alone while a start
    of its session has the lock of the suite's policy, and ends the row only after the program is gone. One
    round of reconcile opens a row that ended while its program runs and ends an open row whose started
    program is gone, and writes each correction to the system log."""

    def __init__(self, launcher: AgentLauncher, program: AgentProgram, transport: ProgramTransport, providers: Providers, repository: Repository,
                 policy: CurrentAgentPolicy, agents: AgentRows, sessions: AgentSessions, environments: EnvironmentRows, queries: Queries, clock: Clock,
                 system_log: SystemLogWriter, dispatch_policy: DispatchPolicy) -> None:
        self.dispatch_policy = dispatch_policy
        self.launcher, self.program, self.transport, self.providers, self.repository, self.policy = launcher, program, transport, providers, repository, policy
        self.agents, self.sessions, self.environments, self.queries, self.clock, self.system_log = agents, sessions, environments, queries, clock, system_log

    def start(self, agent: Agent, command: LaunchCommand) -> Dispatch:
        return self.launcher.hand(agent, self.environments.find(agent.environment_id), command).dispatch

    def stop(self, agent: Agent, reason: StopReason, context: Context) -> Stopped:
        with self.dispatch_policy.lock(agent.session) as available:
            if available:
                self.program.stop(agent)
        if self.has_program(agent):
            return Stopped.PROGRAM_RUNNING
        if agent.ended_at is None:
            self.sessions.ended(agent.id, reason, context)
            self.end_row(agent, context)
            self.record(agent, reason.value)
        return Stopped.PROGRAM_ENDED

    def exited(self, agent: Agent, program_exit: ProgramExit, context: Context) -> None:
        if program_exit.is_other_process(agent.pid):
            self.record(agent, f"the exit of process {program_exit.pid} changed nothing, since process {agent.pid} runs now")
            return
        if agent.ended_at is None:
            self.end_row(agent, context)

    def standing(self, agent: Agent) -> Standing:
        stage = self.stage(agent)
        return Standing(stage, self.end_reason(agent) if stage is StandingState.ENDED else None)

    def stage(self, agent: Agent) -> StandingState:
        if self.has_program(agent):
            return StandingState.RUNNING
        recorded = agent.standing
        if recorded is not StandingState.RUNNING or agent.is_main or agent.announced_at is not None:
            return recorded
        return StandingState.STARTING if agent.launched_at is not None else StandingState.UNSTARTED

    def reconcile(self, context: Context) -> None:
        for agent in self.wrongly_ended_agents():
            self.open_row(agent, context)
            self.record(agent, OPENED_ROW_TEXT)
        for agent in self.wrongly_open_agents():
            self.end_row(agent, context)
            self.record(agent, ENDED_ROW_TEXT)

    def end_session(self, agent: Agent, context: Context) -> Agent:
        if context.actor.id == agent.id and self.transport.has_program(agent.terminal_id):
            self.record(agent, DEFERRED_END_TEXT)
            return agent
        return self.end_row(agent, context)

    def end_lost_process(self, agent: Agent, context: Context) -> Agent:
        if self.transport.has_program(agent.terminal_id):
            self.record(agent, LAUNCHER_PROGRAM_TEXT)
            return agent
        return self.end_row(self.repository.update(agent, context, pid=None, process_started_at=None), context)

    def end_row(self, agent: Agent, context: Context) -> Agent:
        return self.repository.save_change(agent, agent.ended(context.timestamp, self.policy.agent_policy()), context)

    def move_program(self, launch: Agent, resumed: Agent, context: Context) -> Agent:
        self.end_row(launch, replace(context, actor=Actor(launch.id, ActorType.AGENT)))
        return self.repository.update(resumed, context, ended_at=None, pid=launch.pid, process_started_at=launch.process_started_at,
                                      launch_agent_id=launch.id, launch_name=launch.original_launch_name)

    def open_row(self, agent: Agent, context: Context) -> Agent:
        return self.repository.save(replace(agent, ended_at=None), context)

    def record_process(self, agent: Agent, process: ProgramProcess, context: Context) -> Agent:
        return self.repository.save(replace(agent, ended_at=None, pid=process.pid, process_started_at=process.started_at), context)

    def has_program(self, agent: Agent) -> bool:
        return self.transport.has_program(agent.terminal_id) or self.has_open_process(agent)

    def has_open_process(self, agent: Agent) -> bool:
        return agent.ended_at is None and agent.pid is not None and LeftoverProcess.runs_program(agent.pid, self.providers.executable(agent.program))

    def checked_environment_ids(self) -> tuple[int, ...]:
        agents = (*self.recently_ended_agents(), *(agent for agent in self.agents.running() if agent.is_launched_helper))
        return tuple(sorted({agent.environment_id for agent in agents}))

    def recently_ended_agents(self) -> tuple[Agent, ...]:
        earliest = Timestamp(self.clock.timestamp().value - timedelta(seconds=RECENT_END_SECONDS))
        return tuple(self.queries.query(Agent).matching(Minimum("ended_at", earliest.text)).matching(IsNull("retired_at")).all_rows())

    def wrongly_ended_agents(self) -> tuple[Agent, ...]:
        ended = (agent for agent in self.recently_ended_agents() if not self.dispatch_policy.is_final(agent))
        return tuple(agent for agent in ended if self.transport.has_program(agent.terminal_id))

    def wrongly_open_agents(self) -> tuple[Agent, ...]:
        return tuple(agent for agent in self.agents.running() if agent.is_launched_helper and not self.has_program(agent))

    def end_reason(self, agent: Agent) -> str:
        session = self.sessions.current(agent.id)
        return session.end_reason if session is not None and session.end_reason else FINISHED_REASON

    def record(self, agent: Agent, text: str) -> None:
        self.system_log.write(LogLevel.INFORMATION, f"{AgentLabel.from_agent(agent).text} {text}")
