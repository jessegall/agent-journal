from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_INACTIVE = NudgeDeclaration("workers.worker_inactive", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)
BUILDER_BUILDS = NudgeDeclaration("workers.builder_builds", NudgeType.REFUSAL, 'this builder builds its tasks itself: coding.builder-dispatches-workers is false')
CHECK_THE_PROOF = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker {worker} delivered task {task}: check proof {proofs} with journal proof check <proof>, or send it back with journal proof short <proof> --shortfall "<what is missing>"')
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.INSTRUCTION, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', once_per_turn=False)
WORKER_HOLDS_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.REMARK, 'worker {worker} holds task {task}, {title}: its worktree is {state}')

WORKER_NUDGES = [WORKER_INACTIVE, BUILDER_BUILDS, CHECK_THE_PROOF, MERGE_WAITS, WORKER_HOLDS_TASK]
