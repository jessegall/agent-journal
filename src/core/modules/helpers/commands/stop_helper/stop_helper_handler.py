from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper
from core.modules.helpers.support.helper_reach import HelperReach


class StopHelperHandler(Handler[StopHelper, None]):
    """Asks the launcher to stop a helper's program and ends its row; its job ends with it."""

    command = StopHelper

    def __init__(self, reach: HelperReach, bus: Bus, launcher: LauncherLink) -> None:
        self.reach, self.bus, self.launcher = reach, bus, launcher

    def prepare(self, command: StopHelper, actor: Actor) -> None:
        helper = self.reach.checked_helper(command.helper_id, actor)
        if helper.ended_at is None:
            self.launcher.stop(helper.id)

    def handle(self, command: StopHelper, context: Context) -> None:
        helper = self.reach.checked_helper(command.helper_id, context.actor)
        if helper.ended_at is None:
            self.bus.dispatch(EndAgent(helper.id), context)
