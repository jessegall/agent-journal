from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_INACTIVE = NudgeDeclaration("workers.worker_inactive", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)
BUILDER_BUILDS = NudgeDeclaration("workers.builder_builds", NudgeType.REFUSAL, 'this builder builds its tasks itself: coding.builder-dispatches-workers is false')
CHECK_THE_PROOF = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker {worker} delivered task {task}: check proof {proofs} with journal proof check <proof>, or send it back with journal proof short <proof> --shortfall "<what is missing>"')
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.INSTRUCTION, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', once_per_turn=False)
WORKER_HOLDS_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.REMARK, 'worker {worker} holds task {task}, {title}: its worktree is {state}')

WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "that file is in worker {worker}'s worktree: journal worker send {worker} \"<job>\", or wait for its delivery", once_per_turn=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.INSTRUCTION, 'you logged nothing for {minutes} min: log where you stand with journal proof make <point> "<proof>"', repeat_seconds=1800, once_per_turn=False)

WORKER_TEST_TURN = NudgeDeclaration("workers.test_turn", NudgeType.REFUSAL, "only one test run goes at a time, and process {process} of agent {agent} is running tests: wait for .journal/processes/{process}/end with a Monitor, then run yours")
WORKER_NUDGES = [WORKER_TEST_TURN, WORKER_FILE, WORKER_LOG_DUE, WORKER_INACTIVE, BUILDER_BUILDS, CHECK_THE_PROOF, MERGE_WAITS, WORKER_HOLDS_TASK]
