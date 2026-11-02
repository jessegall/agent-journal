from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

DUMP_OPEN = NudgeDeclaration("dumps.dump_open", NudgeType.INSTRUCTION, "dump {dump} is not filed; what is left: journal dump items {dump}", interval=Interval(Seconds(900)), pays="")

DUMP_NUDGES = [DUMP_OPEN]
