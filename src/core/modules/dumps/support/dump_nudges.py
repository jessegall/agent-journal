from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

DUMP_OPEN = NudgeDeclaration("dumps.dump_open", NudgeType.STEERING, "dump {dump} is not filed", interval=Interval(Seconds(900)), required_command="")

DUMP_ARRIVED = NudgeDeclaration("dumps.dump_arrived", NudgeType.STEERING, "dump:{dump} arrived: journal dump items {dump}", required_command="")
DUMP_NUDGES = [DUMP_OPEN, DUMP_ARRIVED]
