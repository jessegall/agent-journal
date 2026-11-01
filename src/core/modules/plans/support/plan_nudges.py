from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

NEXT_TASK = NudgeDeclaration("plans.next_task", NudgeType.INSTRUCTION, "task {task}, {title}, is in hand{place}: {brief}", longest_characters=1600, once_per_turn=False)
PLAN_FINISHED = NudgeDeclaration("plans.plan_finished", NudgeType.INSTRUCTION, "plan {plan} done: run the final suite; merging to main and releasing wait for the user's word", once_per_turn=False)
PHASE_FINISHED = NudgeDeclaration("plans.phase_finished", NudgeType.REMARK, "plan {plan}: phase {phase} done", once_per_turn=False)
CHECKPOINT_FINISHED = NudgeDeclaration("plans.checkpoint_finished", NudgeType.INSTRUCTION, "plan {plan}: phase {phase} done, a checkpoint: tell the user and wait for their word", once_per_turn=False)
PLAN_STALLED = NudgeDeclaration("plans.plan_stalled", NudgeType.INSTRUCTION, "plan {plan}: no task can start; {count} wait or are blocked", once_per_turn=False)
PLAN_APPROVED = NudgeDeclaration("plans.plan_approved", NudgeType.INSTRUCTION, "plan {plan} approved", once_per_turn=False)
PLAN_CANCELLED = NudgeDeclaration("plans.plan_cancelled", NudgeType.INSTRUCTION, "plan {plan} cancelled: {reason}", once_per_turn=False)
PLAN_BLOCKED = NudgeDeclaration("plans.plan_blocked", NudgeType.INSTRUCTION, "plan {plan} is blocked: {reason}", once_per_turn=False)
UNLINKED_TASKS = NudgeDeclaration("plans.unlinked_tasks", NudgeType.REMARK, "plan {plan}: {count} open tasks, none blocked; set what each waits on: journal task block <n> --on task:<m>", once_per_turn=False)

PLAN_NUDGES = [UNLINKED_TASKS, NEXT_TASK, PLAN_FINISHED, PHASE_FINISHED, CHECKPOINT_FINISHED, PLAN_STALLED, PLAN_APPROVED, PLAN_CANCELLED, PLAN_BLOCKED]
