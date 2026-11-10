from engine.actor.actor import Actor
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.listener.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.helpers.support.helper_resume import HelperResume


class HelperProgramListener(CommitListener[Created[HelperJob]]):
    """A helper's first job hands the running launcher its program, folder and agent row; a later job resumes it.
    A launch can take a minute, so it runs in the round of program stops and holds no ordinary listener."""

    name = "helpers.helper-program-request"
    run_order = PROGRAM_STOP_RUN_ORDER

    def __init__(self, launcher: AgentLauncher, helper_command: HelperCommand, bus: Bus, environments: EnvironmentRows, agents: AgentRows, resume: HelperResume) -> None:
        self.launcher, self.helper_command, self.bus, self.environments, self.agents = launcher, helper_command, bus, environments, agents
        self.helper_resume = resume

    def handle(self, event: Created[HelperJob], logged: LoggedEvent) -> None:
        if event.row.source_line_id is not None:
            return
        helper_id = event.row.helper_id
        if helper_id is None:
            return
        helper = self.agents.find(helper_id)
        if event.row.tool_key != helper.session:
            self.helper_resume.resume(helper, event.row.brief)
            return
        try:
            command = self.helper_command.command(helper, event.row)
        except Exception:
            self.bus.run(RecordAgentLaunchFailure(helper.id), Actor.core(), environment_id=helper.environment_id)
            raise
        self.launcher.hand(helper, self.environments.find(helper.environment_id), command)
