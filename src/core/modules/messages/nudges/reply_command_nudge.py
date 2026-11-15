from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class ReplyCommandNudge(NudgeDeclaration):
    """The nudge messages.reply_command."""

    key = "messages.reply_command"
    type = NudgeType.STEERING
    text = "Your chat words are your reply: in a turn that continues, reply first"
    interval = Interval(Seconds(1800))
