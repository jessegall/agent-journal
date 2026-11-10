from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

DUMP_OPEN = NudgeDeclaration("dumps.dump_open", NudgeType.STEERING, "dump {dump} is not filed", interval=Interval(Seconds(900)))

DUMP_ARRIVED = NudgeDeclaration("dumps.dump_arrived", NudgeType.STEERING, "dump:{dump} arrived")
DUMP_NUDGES = [DUMP_OPEN, DUMP_ARRIVED]
