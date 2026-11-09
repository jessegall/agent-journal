from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MERGER_PROFILE = "journal-merger"
MERGER_SOURCE = "merger"
MERGER_JOB = "A worker waits for its merge: journal merger next"
NO_WORKER_WAITING = "no worker waits: stop"
MERGER_FINDINGS_PREFIX = "From the merger, please fix this: "
WORKER_MERGED = NudgeDeclaration("workers.worker_merged", NudgeType.STEERING, "worker:{worker} was merged", plural_text="workers {worker} were merged", id_field="worker", wakes_agent=True)
MERGER_PASSED = NudgeDeclaration("workers.merger_passed", NudgeType.STEERING, "the merger leaves worker:{worker} to you: its merge waits on you",
                                 plural_text="the merger leaves workers {worker} to you: their merges wait on you", id_field="worker", wakes_agent=True)

MERGER_LINE_AVAILABLE = NudgeDeclaration("workers.merger_line_available", NudgeType.STEERING, "merger-line:{line}", turn_limited=False, wakes_agent=True, id_field="line", plural_text="merger-lines {line}")
