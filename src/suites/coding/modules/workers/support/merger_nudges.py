from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MERGER_PROFILE = "journal-merger"
MERGER_SOURCE = "merger"
MERGER_JOB = "A worker waits for its merge: journal merger next"
NO_WORKER_WAITING = "no worker waits: stop"
MERGER_FINDINGS_PREFIX = "From the merger, please fix this: "
MERGER_PASSED = NudgeDeclaration("workers.merger_passed", NudgeType.STEERING, "the merger leaves worker:{worker} to you: {reason}. Read journal worker logs {worker}")
