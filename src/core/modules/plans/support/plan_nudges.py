from core.modules.plans.nudges.plan_finished_nudge import PlanFinishedNudge
from core.modules.plans.nudges.phase_finished_nudge import PhaseFinishedNudge
from core.modules.plans.nudges.checkpoint_reached_nudge import CheckpointReachedNudge
from core.modules.plans.nudges.checkpoint_finished_nudge import CheckpointFinishedNudge
from core.modules.plans.nudges.checkpoint_awaits_approval_nudge import CheckpointAwaitsApprovalNudge
from core.modules.plans.nudges.plan_stalled_nudge import PlanStalledNudge
from core.modules.plans.nudges.focus_suggested_nudge import FocusSuggestedNudge
from core.modules.plans.nudges.unfocused_task_nudge import UnfocusedTaskNudge
from core.modules.plans.nudges.plan_approved_nudge import PlanApprovedNudge
from core.modules.plans.nudges.plan_approved_with_message_nudge import PlanApprovedWithMessageNudge
from core.modules.plans.nudges.plan_waiting_nudge import PlanWaitingNudge
from core.modules.plans.nudges.plan_cancelled_nudge import PlanCancelledNudge
from core.modules.plans.nudges.plan_blocked_nudge import PlanBlockedNudge
from core.modules.plans.nudges.plan_opened_nudge import PlanOpenedNudge
from core.modules.plans.nudges.plan_context_nudge import PlanContextNudge
from core.modules.plans.nudges.unlinked_tasks_nudge import UnlinkedTasksNudge


PLAN_NUDGES = [UnlinkedTasksNudge, PlanFinishedNudge, PhaseFinishedNudge, CheckpointReachedNudge, CheckpointFinishedNudge, CheckpointAwaitsApprovalNudge, PlanStalledNudge, PlanApprovedNudge,
               PlanWaitingNudge, PlanApprovedWithMessageNudge, PlanCancelledNudge, PlanBlockedNudge, PlanOpenedNudge, PlanContextNudge, FocusSuggestedNudge,
               UnfocusedTaskNudge]
