from core.base.actor import Actor
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.helper_command import HelperCommand


class HelperProgramListener(CommitListener[Created[HelperJob]]):
    """A helper's first job hands the running launcher its program, folder and agent row to start."""

    name = "helpers.helper-program-request"

    def __init__(self, launcher: AgentLauncher, helper_command: HelperCommand, queries: Queries, bus: Bus, environments: EnvironmentRows, agents: AgentRows) -> None:
        self.launcher, self.helper_command, self.queries, self.bus, self.environments, self.agents = launcher, helper_command, queries, bus, environments, agents

    def handle(self, event: Created[HelperJob], logged: LoggedEvent) -> None:
        helper_id = event.row.helper_id
        if helper_id is None or self.queries.query(HelperJob).filter(helper_id=helper_id).count() > 1:
            return
        helper = self.agents.find(helper_id)
        try:
            command = self.helper_command.command(helper, event.row)
        except Exception:
            self.bus.run(RecordAgentLaunchFailure(helper.id), Actor.core(), environment_id=helper.environment_id)
            raise
        self.launcher.hand(helper, self.environments.find(helper.environment_id), command)
