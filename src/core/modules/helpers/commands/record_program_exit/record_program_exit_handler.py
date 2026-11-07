from core.base.profile.agent_profile import AgentProfile
from core.base.log_level import LogLevel
from core.base.system_log_writer import SystemLogWriter
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent.end_agent import EndAgent
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


class RecordProgramExitHandler(Handler[RecordProgramExit, None]):
    """Ends the row of an agent whose program exited, so a program that fires no last hook still ends; an
    open job ends through a report, with what the transcript holds or why the program ended. It reads the
    terminal log and the transcript outside any transaction."""

    command = RecordProgramExit

    def __init__(self, queries: Queries, jobs: HelperJobRows, providers: Providers, folders: AgentFolders, reasons: ExitReasons, bus: Bus, system_log: SystemLogWriter, profiles: ProfileFiles) -> None:
        self.queries, self.jobs, self.providers, self.folders, self.reasons, self.bus, self.system_log, self.profiles = queries, jobs, providers, folders, reasons, bus, system_log, profiles

    def handle(self, command: RecordProgramExit, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.role == AgentRole.MAIN or self.is_earlier_run(agent, command):
            return
        actor = Actor(agent.id, ActorType.AGENT)
        job = self.jobs.open_job(agent.id)
        if job is not None and self.needs_exit_report(agent):
            self.report_exit(agent, job, command, actor)
        if agent.ended_at is None:
            self.bus.run(EndAgent(agent.id), actor, environment_id=agent.environment_id)

    def is_earlier_run(self, agent: Agent, command: RecordProgramExit) -> bool:
        if command.pid is None or agent.pid is None or command.pid == agent.pid:
            return False
        self.system_log.write(LogLevel.INFORMATION, f"agent {agent.id}: the exit of process {command.pid} changed nothing, since process {agent.pid} runs now")
        return True

    def needs_exit_report(self, agent: Agent) -> bool:
        has_waiting_job = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING, source=HELPER_JOB_SOURCE).exists()
        return agent.parent_id is not None and not has_waiting_job

    def report_exit(self, agent: Agent, job: HelperJob, command: RecordProgramExit, actor: Actor) -> None:
        transcript_text = self.providers.provider(agent.program).last_reply(self.folders.folder(agent), agent.session)
        text = transcript_text or self.reasons.reason(agent, command.exit_code, command.launch_ended)
        self.bus.run(RecordParentReport(agent.id, agent.parent_id, text, job.id), actor, environment_id=agent.environment_id)
        profile = self.profiles.registered(agent.profile)
        if self.needs_fault_notice(profile, command):
            self.bus.run(SendProgramFault(agent.id, command.exit_code), actor, environment_id=agent.environment_id)

    @staticmethod
    def needs_fault_notice(profile: AgentProfile | None, command: RecordProgramExit) -> bool:
        return bool(command.exit_code) and profile is not None and not profile.reports_to_parent
