from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MERGER_PROFILE = "journal-merger"
MERGER_SOURCE = "merger"
MERGER_JOB = "A worker waits for its merge: journal merger next"
NO_WORKER_WAITING = "no worker waits: stop"
MERGER_FINDINGS_PREFIX = "From the merger, please fix this: "
MERGER_MERGED = NudgeDeclaration("workers.merger_merged", NudgeType.STEERING, "the merger merged worker:{worker}", plural_text="the merger merged workers {worker}", id_field="worker")
MERGER_PASSED = NudgeDeclaration("workers.merger_passed", NudgeType.STEERING, "the merger leaves worker:{worker} to you. Read journal worker logs {worker}",
                                 plural_text="the merger leaves workers {worker} to you. Read journal worker logs <id> for each", id_field="worker", wakes_agent=True)

MERGER_LINE_AVAILABLE = NudgeDeclaration("workers.merger_line_available", NudgeType.STEERING, "merger-line:{line}: journal merger-line show {line}; journal merger next", turn_limited=False, wakes_agent=True, id_field="line", plural_text="merger-lines {line}: read each with journal merger-line show <id>; journal merger next")
