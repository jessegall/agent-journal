from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.agents.support.receivers import Receivers
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.commands.warn_helper_limit.warn_helper_limit import WarnHelperLimit

HELPER_LIMIT_WARNING = NudgeDeclaration("helpers.limit_warning", NudgeType.STEERING, "helper:{helper} is near its {limit} limit: journal helper stop {helper}, or let it run out", turn_limited=False)


class WarnHelperLimitHandler(Handler[WarnHelperLimit, None]):
    """Gives the parent the line that its helper is near a limit."""

    command = WarnHelperLimit

    def __init__(self, nudger: Nudger, receivers: Receivers) -> None:
        self.nudger, self.receivers = nudger, receivers

    def handle(self, command: WarnHelperLimit, context: Context) -> None:
        receiver = self.receivers.receiver(command.parent_id)
        self.nudger.send(receiver.id, HELPER_LIMIT_WARNING, WarnHelperLimit.source(command.job_id), context, helper=command.helper_id, limit=command.limit_name)
