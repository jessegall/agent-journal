from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_INACTIVE = NudgeDeclaration("workers.worker_inactive", NudgeType.INSTRUCTION, 'worker:{worker} has used no tool for {minutes} minutes', turn_limited=False)
BUILDER_BUILDS = NudgeDeclaration("workers.builder_builds", NudgeType.REFUSAL, 'this builder builds its tasks itself: coding.builder-dispatches-workers is false')
PROOF_CHECK = NudgeDeclaration("workers.check_the_proof", NudgeType.REFUSAL, 'worker:{worker} delivered task:{task}: journal proof check {proofs}, or journal proof short <proof> "<what is missing>"')
MERGE_WAITS = NudgeDeclaration("workers.merge_waits", NudgeType.INSTRUCTION, 'the merge of worker {worker} waits for the checkout of environment {environment} to return to {branch}', turn_limited=False)
WORKER_TASK = NudgeDeclaration("workers.worker_holds_task", NudgeType.NUDGE, 'worker:{worker} holds task:{task}: its worktree is {state}')

WORKER_FILE = NudgeDeclaration("workers.file_is_the_workers", NudgeType.REFUSAL, "that file is in worker {worker}'s worktree: journal worker send {worker} \"<job>\", or wait for its delivery", turn_limited=False)
WORKER_LOG_DUE = NudgeDeclaration("workers.worker_log_due", NudgeType.INSTRUCTION, 'you logged nothing for {minutes} min: log where you stand with journal proof make <point> "<proof>"', interval=Interval(Seconds(1800)), turn_limited=False, required_command="")

WORKER_TEST_TURN = NudgeDeclaration("workers.test_turn", NudgeType.REFUSAL, 'one test run goes at a time: process {process} of agent {agent} is running; monitor it, then run yours')
WORKER_NUDGES = [WORKER_TEST_TURN, WORKER_FILE, WORKER_LOG_DUE, WORKER_INACTIVE, BUILDER_BUILDS, PROOF_CHECK, MERGE_WAITS, WORKER_TASK]
