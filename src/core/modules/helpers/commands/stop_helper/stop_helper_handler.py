from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper
from core.modules.helpers.support.helper_reach import HelperReach


class StopHelperHandler(Handler[StopHelper, None]):
    """Ends a helper's row; HelperEndedListener then ends its job as stopped and EndedAgentProgramListener stops its
    program."""

    command = StopHelper

    def __init__(self, reach: HelperReach, bus: Bus) -> None:
        self.reach, self.bus = reach, bus

    def handle(self, command: StopHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context.actor)
        if helper.ended_at is None:
            self.bus.dispatch(EndAgent(helper.id), context)
