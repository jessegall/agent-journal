from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

MERGER_PROFILE = "journal-merger"
MERGER_SOURCE = "merger"
MERGER_JOB = "A worker waits for its merge: journal merger next"
NO_WORKER_WAITING = "no worker waits: stop"
MERGER_FINDINGS_PREFIX = "From the merger, please fix this: "
MERGE_HOOK_FAILED = NudgeDeclaration("workers.merge_hook_failed", NudgeType.STEERING, "the merge hook {command!r} of worker:{worker} failed, and its merge stands: run it in the checkout to read its output", wakes_agent=True)
WORKER_MERGED = NudgeDeclaration("workers.worker_merged", NudgeType.STEERING, "worker:{worker} was merged", plural_text="workers {worker} were merged", id_field="worker", wakes_agent=True)
UNIT_MERGE_WAITS = NudgeDeclaration("workers.unit_merge_waits", NudgeType.STEERING, "worker:{worker} waits for its unit merge in merge-ask:{merge_ask}; the merger is off", wakes_agent=True)
UNIT_MERGED = NudgeDeclaration("workers.unit_merged", NudgeType.STEERING, "worker:{worker} merged {count} tasks; its note is in merge-ask:{merge_ask}", wakes_agent=True)
MERGER_PASSED = NudgeDeclaration("workers.merger_passed", NudgeType.STEERING, "The merger passed worker:{worker} to you: its merge waits on you",
                                 plural_text="the merger leaves workers {worker} to you: their merges wait on you", id_field="worker", wakes_agent=True)

MERGER_LINE_AVAILABLE = NudgeDeclaration("workers.merger_line_available", NudgeType.STEERING, "merger-line:{line}", turn_limited=False, wakes_agent=True, id_field="line", plural_text="merger-lines {line}")
