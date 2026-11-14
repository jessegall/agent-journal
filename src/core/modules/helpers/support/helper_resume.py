from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob
from core.modules.helpers.commands.record_job_new_session.record_job_new_session import RecordJobNewSession
from core.modules.agents.support.agent_conversations import AgentConversations
from core.modules.agents.support.agent_resume import AgentResume
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.profiles.support.profile_files import ProfileFiles

FAILED_START_TEXT = "The program could not start."


class HelperResume:
    """Starts an ended helper's session again in its folder, with a job as its brief, or a new session when
    its old one has gone cold and its profile replaces a cold session. A helper whose profile replaces its
    session at each launch continues here like one that keeps it: a job that is open never changes session
    for that reason. A new session gets the whole brief of the open job, since it has read none of it. The
    program starts on the one path every agent is started again on. When that start fails, its open job
    ends, so the next job sent to the helper starts the session the helper has now."""

    def __init__(self, commands: HelperCommand, kept: KeptHelpers, cold: ColdSessions, conversations: AgentConversations, jobs: HelperJobRows, bus: Bus, profiles: ProfileFiles, agent_resume: AgentResume) -> None:
        self.commands, self.kept, self.cold, self.conversations = commands, kept, cold, conversations
        self.jobs, self.bus, self.profiles, self.agent_resume = jobs, bus, profiles, agent_resume

    def resume(self, helper: Agent, job: str) -> Dispatch:
        if not self.agent_resume.may_resume(helper) or not self.kept.program_state(helper).is_ready:
            return Dispatch.REFUSED
        current = self.cold.replaced(helper, self.profiles.effective(helper.profile).occupant.continuation)
        command = self.commands.resumed(current, job) if self.conversations.exists(current) else self.restarted(current, job)
        dispatch = self.agent_resume.resume(current, command)
        if dispatch is Dispatch.FAILED:
            self.end_open_job(current)
        return dispatch

    def restarted(self, helper: Agent, job: str) -> LaunchCommand:
        open_job = self.jobs.open_job(helper.id)
        if open_job is not None and not open_job.new_session:
            self.bus.run(RecordJobNewSession(open_job.id, helper.session), Actor.core(), environment_id=helper.environment_id)
        return self.commands.restarted(helper, self.whole_brief(helper, job))

    def whole_brief(self, helper: Agent, job: str) -> str:
        open_job = self.jobs.open_job(helper.id)
        if open_job is None:
            return job
        return open_job.brief if job in open_job.brief else f"{open_job.brief}\n\n{job}"

    def end_open_job(self, helper: Agent) -> None:
        job = self.jobs.open_job(helper.id)
        if job is not None:
            self.bus.run(EndHelperJob(job.id, FAILED_START_TEXT), Actor.core(), environment_id=helper.environment_id)
