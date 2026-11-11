from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.listener.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_standing import AgentStanding
from core.modules.agents.support.report_nudges import PARENT_REPORT_SOURCE
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.helpers.support.helper_resume import HelperResume


class MessagedHelperListener(CommitListener[Created[AgentLine]]):
    """A message for a helper whose program has ended starts that program again under the same agent, with
    the line that names the message as its job: its old session when that can be resumed, a new one when it
    has gone cold. With no launcher running the line waits for the helper's next start. A launch can take a
    minute, so it runs in the round of program stops."""

    name = "helpers.messaged-helper"
    run_order = PROGRAM_STOP_RUN_ORDER
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, resume: HelperResume, bus: Bus, standings: AgentStanding) -> None:
        self.agents, self.helper_resume, self.bus, self.standings = agents, resume, bus, standings

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        if line.source != PARENT_REPORT_SOURCE:
            return
        helper = self.agents.find(line.session_agent_id)
        if helper.ended_at is None or not helper.is_kept_helper or not self.standings.is_launcher_running:
            return
        if self.helper_resume.resume(helper, line.text) is Dispatch.STARTED:
            self.bus.run(EnterAgentLine(line.id), Actor.core(), environment_id=helper.environment_id)
