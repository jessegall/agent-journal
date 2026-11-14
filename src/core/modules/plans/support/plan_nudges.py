from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PLAN_FINISHED = NudgeDeclaration("plans.plan_finished", NudgeType.STEERING, "Plan {plan} done: run the full suite; merging to main and releasing wait for the user's go-ahead", turn_limited=False)
PHASE_FINISHED = NudgeDeclaration("plans.phase_finished", NudgeType.STEERING, "plan {plan}: phase {phase} done", turn_limited=False)
CHECKPOINT_REACHED = NudgeDeclaration("plans.checkpoint_reached", NudgeType.STEERING, "plan {plan}: phase {phase} is done and is a checkpoint: later phases wait for its tests", turn_limited=False)
CHECKPOINT_FINISHED = NudgeDeclaration("plans.checkpoint_finished", NudgeType.STEERING, "plan {plan}: checkpoint phase {phase} tests passed and later phases are open: tell the user", turn_limited=False)
CHECKPOINT_AWAITS_APPROVAL = NudgeDeclaration("plans.checkpoint_awaits_approval", NudgeType.STEERING, "plan {plan}: checkpoint phase {phase} passed its tests; later phases open once a user approves it on the plan card", turn_limited=False)
PLAN_STALLED = NudgeDeclaration("plans.plan_stalled", NudgeType.NOTICE, "plan {plan}: no task can start; {count} are waiting or blocked{waits}", turn_limited=False)
FOCUS_SUGGESTED = NudgeDeclaration("plans.focus_suggested", NudgeType.NOTICE, "Plans {plans} started; your default focus is plan {focus}", turn_limited=False)
UNFOCUSED_TASK = NudgeDeclaration("plans.unfocused_task", NudgeType.NOTICE, "Task {task} belongs to plan {plan}; your focus is plan {focus}", turn_limited=False)
PLAN_APPROVED = NudgeDeclaration("plans.plan_approved", NudgeType.NOTICE, "Plan {plan} approved", turn_limited=False)
PLAN_APPROVED_WITH_MESSAGE = NudgeDeclaration("plans.plan_approved_message", NudgeType.NOTICE,
                                             "Plan {plan} approved with a message: read message {message} before starting",
                                             turn_limited=False)
PLAN_WAITING = NudgeDeclaration("plans.plan_waiting", NudgeType.NOTICE, "Plan {plan} is ready: a user approves it on its plan card", turn_limited=False)
PLAN_CANCELLED = NudgeDeclaration("plans.plan_cancelled", NudgeType.NOTICE, "plan:{plan} is cancelled", turn_limited=False)
PLAN_BLOCKED = NudgeDeclaration("plans.plan_blocked", NudgeType.NOTICE, "plan:{plan} is blocked", turn_limited=False)
PLAN_OPENED = NudgeDeclaration("plans.plan_opened", NudgeType.STEERING, "plan:{plan} is open again: the plans it waited on have ended", turn_limited=False)
PLAN_CONTEXT = NudgeDeclaration("plans.start_context", NudgeType.STEERING,
                               "Plan {plan} started: read its context before changing project files", turn_limited=False)
UNLINKED_TASKS = NudgeDeclaration("plans.unlinked_tasks", NudgeType.STEERING, "plan {plan}: {count} open tasks, none blocked: set what each one waits on", turn_limited=False)

PLAN_NUDGES = [UNLINKED_TASKS, PLAN_FINISHED, PHASE_FINISHED, CHECKPOINT_REACHED, CHECKPOINT_FINISHED, CHECKPOINT_AWAITS_APPROVAL, PLAN_STALLED, PLAN_APPROVED,
               PLAN_WAITING, PLAN_APPROVED_WITH_MESSAGE, PLAN_CANCELLED, PLAN_BLOCKED, PLAN_OPENED, PLAN_CONTEXT, FOCUS_SUGGESTED,
               UNFOCUSED_TASK]
