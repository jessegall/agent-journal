from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PLAN_FINISHED = NudgeDeclaration("plans.plan_finished", NudgeType.STEERING, "plan {plan} done: run the final suite; merging to main and releasing wait for the user's word", turn_limited=False)
PHASE_FINISHED = NudgeDeclaration("plans.phase_finished", NudgeType.STEERING, "plan {plan}: phase {phase} done", turn_limited=False)
CHECKPOINT_FINISHED = NudgeDeclaration("plans.checkpoint_finished", NudgeType.STEERING, "plan {plan}: phase {phase} done, a checkpoint: tell the user and wait for their word", turn_limited=False)
PLAN_STALLED = NudgeDeclaration("plans.plan_stalled", NudgeType.NOTICE, "plan {plan}: no task can start; {count} wait or are blocked", turn_limited=False)
PLAN_APPROVED = NudgeDeclaration("plans.plan_approved", NudgeType.NOTICE, "plan {plan} approved", turn_limited=False)
PLAN_APPROVED_WITH_MESSAGE = NudgeDeclaration("plans.plan_approved_message", NudgeType.NOTICE,
                                             "plan {plan} approved with a message: read message {message} before you start",
                                             turn_limited=False)
PLAN_CANCELLED = NudgeDeclaration("plans.plan_cancelled", NudgeType.NOTICE, "plan:{plan} is cancelled", turn_limited=False)
PLAN_BLOCKED = NudgeDeclaration("plans.plan_blocked", NudgeType.NOTICE, "plan:{plan} is blocked", turn_limited=False)
PLAN_CONTEXT = NudgeDeclaration("plans.start_context", NudgeType.STEERING,
                               "plan {plan} started: read its context before changing project files", turn_limited=False)
UNLINKED_TASKS = NudgeDeclaration("plans.unlinked_tasks", NudgeType.STEERING, "plan {plan}: {count} open tasks, none blocked; set what each waits on", turn_limited=False)

PLAN_NUDGES = [UNLINKED_TASKS, PLAN_FINISHED, PHASE_FINISHED, CHECKPOINT_FINISHED, PLAN_STALLED, PLAN_APPROVED,
               PLAN_APPROVED_WITH_MESSAGE, PLAN_CANCELLED, PLAN_BLOCKED, PLAN_CONTEXT]
