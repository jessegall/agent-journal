from engine.profile.agent_profile import AgentProfile
from engine.enums.log_level import LogLevel
from dataclasses import replace
from datetime import timedelta

from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from engine.log.system_log_writer import SystemLogWriter
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.program_exit import ProgramExit
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.record_program_exit.record_program_exit import RecordProgramExit
from core.modules.helpers.commands.send_program_fault.send_program_fault import SendProgramFault
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.helpers.support.exit_reasons import ExitReasons
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.commands.make_provider_outage.make_provider_outage import MakeProviderOutage
from core.modules.agents.support.agent_label import AgentLabel

OUTAGE_MINUTES = 15


class RecordProgramExitHandler(Handler[RecordProgramExit, None]):
    """Ends the row of an agent whose program exited, so a program that fires no last hook still ends; an
    open job ends through a report, with what the transcript holds or why the program ended. It reads the
    terminal log and the transcript outside any transaction."""

    command = RecordProgramExit

    def __init__(self, queries: Queries, jobs: HelperJobRows, providers: Providers, folders: AgentFolders, reasons: ExitReasons, bus: Bus, system_log: SystemLogWriter, clock: Clock, profiles: ProfileFiles, dispatcher: AgentDispatcher) -> None:
        self.dispatcher = dispatcher
        self.queries, self.jobs, self.providers, self.folders, self.reasons, self.bus, self.system_log = queries, jobs, providers, folders, reasons, bus, system_log
        self.clock, self.profiles = clock, profiles

    def handle(self, command: RecordProgramExit, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.is_main or self.is_earlier_run(agent, command):
            return
        actor = Actor(agent.id, ActorType.AGENT)
        terminal = self.reasons.terminal_tail(agent)
        if command.exit_code != 0 and not command.launch_ended:
            problem = self.reasons.program_problem(agent, terminal)
            if problem:
                ends_at = Timestamp(self.clock.timestamp().value + timedelta(minutes=OUTAGE_MINUTES))
                self.bus.run(MakeProviderOutage(agent.program, problem, ends_at), Actor.core(), environment_id=agent.environment_id)
        job = self.jobs.open_job(agent.id)
        if job is not None and self.needs_exit_report(agent):
            self.report_exit(agent, job, command, actor, terminal)
        self.dispatcher.exited(agent, ProgramExit(command.exit_code, command.pid, command.launch_ended), replace(context, actor=actor))

    def is_earlier_run(self, agent: Agent, command: RecordProgramExit) -> bool:
        if command.pid is None or agent.pid is None or command.pid == agent.pid:
            return False
        self.system_log.write(LogLevel.INFORMATION, f"{AgentLabel.labelled(agent).text}: the exit of process {command.pid} changed nothing, since process {agent.pid} runs now")
        return True

    def needs_exit_report(self, agent: Agent) -> bool:
        has_waiting_job = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING, source=HELPER_JOB_SOURCE).exists()
        return agent.parent_id is not None and not has_waiting_job

    def report_exit(self, agent: Agent, job: HelperJob, command: RecordProgramExit, actor: Actor, terminal: str) -> None:
        transcript_text = self.providers.provider(agent.program).last_reply(self.folders.folder(agent), agent.session)
        text = transcript_text or self.reasons.reason(agent, command.exit_code, command.launch_ended, terminal)
        self.bus.run(RecordParentReport(agent.id, agent.required_parent_id(), text, job.id), actor, environment_id=agent.environment_id)
        if not command.exit_code:
            return
        profile = self.profiles.registered(agent.profile)
        if self.needs_fault_notice(profile, command):
            self.bus.run(SendProgramFault(agent.id, command.exit_code), actor, environment_id=agent.environment_id)

    @staticmethod
    def needs_fault_notice(profile: AgentProfile | None, command: RecordProgramExit) -> bool:
        return bool(command.exit_code) and profile is not None and not profile.has_parent_report
