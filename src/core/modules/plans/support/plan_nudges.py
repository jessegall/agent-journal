from core.modules.plans.nudges.plan_finished_message import PlanFinishedMessage
from core.modules.plans.nudges.phase_finished_message import PhaseFinishedMessage
from core.modules.plans.nudges.checkpoint_reached_message import CheckpointReachedMessage
from core.modules.plans.nudges.checkpoint_finished_message import CheckpointFinishedMessage
from core.modules.plans.nudges.plan_stalled_message import PlanStalledMessage
from core.modules.plans.nudges.focus_suggested_message import FocusSuggestedMessage
from core.modules.plans.nudges.unfocused_task_message import UnfocusedTaskMessage
from core.modules.plans.nudges.plan_approved_message import PlanApprovedMessage
from core.modules.plans.nudges.plan_approval_note_message import PlanApprovalNoteMessage
from core.modules.plans.nudges.plan_waiting_message import PlanWaitingMessage
from core.modules.plans.nudges.plan_cancelled_message import PlanCancelledMessage
from core.modules.plans.nudges.plan_blocked_message import PlanBlockedMessage
from core.modules.plans.nudges.plan_opened_message import PlanOpenedMessage
from core.modules.plans.nudges.plan_context_message import PlanContextMessage
from core.modules.plans.nudges.unlinked_tasks_message import UnlinkedTasksMessage


PLAN_NUDGES = [UnlinkedTasksMessage, PlanFinishedMessage, PhaseFinishedMessage, CheckpointReachedMessage, CheckpointFinishedMessage, PlanStalledMessage, PlanApprovedMessage,
               PlanWaitingMessage, PlanApprovalNoteMessage, PlanCancelledMessage, PlanBlockedMessage, PlanOpenedMessage, PlanContextMessage, FocusSuggestedMessage,
               UnfocusedTaskMessage]
