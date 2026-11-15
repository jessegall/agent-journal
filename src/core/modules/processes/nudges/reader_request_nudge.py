from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType

READER_REQUEST_REMINDER = Seconds(600)


class ReaderRequestNudge(NudgeDeclaration):
    """The nudge processes.reader_request."""

    key = "processes.reader_request"
    type = NudgeType.STEERING
    text = "Reader request {request}: agent {agent} needs a reader for output {output}"
    interval = Interval(READER_REQUEST_REMINDER)
    turn_limited = False
