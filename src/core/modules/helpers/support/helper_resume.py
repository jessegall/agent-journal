from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.launch_answer import LaunchAnswer
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob
from core.modules.agents.support.agent_conversations import AgentConversations
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.profiles.support.profile_files import ProfileFiles

FAILED_START_TEXT = "The program could not start."


class HelperResume:
    """Starts an ended helper's session again in its folder, with a job as its brief, or a new session when
    its old one has gone cold and its profile replaces a cold session. A helper whose profile replaces its
    session at each launch continues here like one that keeps it: a job that is open never changes session
    for that reason. A new session gets the whole brief of the open job, since it has read none of it. When the launcher cannot start it, its open job ends, so the next job sent to
    the helper starts the session the helper has now."""

    def __init__(self, launcher: AgentLauncher, commands: HelperCommand, environments: EnvironmentRows, kept: KeptHelpers, cold: ColdSessions, conversations: AgentConversations, jobs: HelperJobRows, bus: Bus, profiles: ProfileFiles) -> None:
        self.launcher, self.commands, self.environments = launcher, commands, environments
        self.kept, self.cold, self.conversations = kept, cold, conversations
        self.jobs, self.bus, self.profiles = jobs, bus, profiles

    def resume(self, helper: Agent, job: str) -> None:
        if helper.paused_at is not None or not self.kept.program_state(helper).is_ready:
            return
        current = self.cold.replaced(helper, self.profiles.effective(helper.profile).occupant.continuation)
        command = self.commands.resumed(current, job) if self.conversations.exists(current) else self.commands.restarted(current, self.whole_brief(current, job))
        if self.launcher.hand(current, self.environments.find(helper.environment_id), command) is LaunchAnswer.FAILED:
            self.end_open_job(current)

    def whole_brief(self, helper: Agent, job: str) -> str:
        open_job = self.jobs.open_job(helper.id)
        if open_job is None:
            return job
        return open_job.brief if job in open_job.brief else f"{open_job.brief}\n\n{job}"

    def end_open_job(self, helper: Agent) -> None:
        job = self.jobs.open_job(helper.id)
        if job is not None:
            self.bus.run(EndHelperJob(job.id, FAILED_START_TEXT), Actor.core(), environment_id=helper.environment_id)
