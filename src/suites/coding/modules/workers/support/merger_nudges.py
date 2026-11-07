from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MERGER_PROFILE = "journal-merger"
MERGER_SOURCE = "merger"
MERGER_JOB = "A worker waits for its merge: journal merger next"
NO_WORKER_WAITING = "no worker waits: stop"
SENT_BACK_BY_MERGER = "From the merger, please fix this: "
MERGER_PASSED = NudgeDeclaration("workers.merger_passed", NudgeType.STEERING, "the merger leaves worker:{worker} to you: {reason}. Read journal worker logs {worker}",
                                 plural_text="the merger leaves workers {worker} to you: {reason}. Read journal worker logs <id> for each", id_field="worker", wakes_agent=True)
