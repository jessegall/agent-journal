from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper
from core.modules.helpers.support.helper_reach import HelperReach


class StopHelperHandler(Handler[StopHelper, None]):
    """Stops a helper's program when its process is known and ends its row; its job ends with it."""

    command = StopHelper

    def __init__(self, reach: HelperReach, bus: Bus) -> None:
        self.reach, self.bus = reach, bus

    def handle(self, command: StopHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context)
        if helper.ended_at is not None:
            return
        self.bus.dispatch(EndAgent(helper.id) if helper.pid is None else StopAgent(helper.id), context)
