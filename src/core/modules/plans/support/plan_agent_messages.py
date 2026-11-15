from core.modules.plans.agent_messages.plan_finished_message import PlanFinishedMessage
from core.modules.plans.agent_messages.phase_finished_message import PhaseFinishedMessage
from core.modules.plans.agent_messages.checkpoint_reached_message import CheckpointReachedMessage
from core.modules.plans.agent_messages.checkpoint_finished_message import CheckpointFinishedMessage
from core.modules.plans.agent_messages.plan_stalled_message import PlanStalledMessage
from core.modules.plans.agent_messages.focus_suggested_message import FocusSuggestedMessage
from core.modules.plans.agent_messages.unfocused_task_message import UnfocusedTaskMessage
from core.modules.plans.agent_messages.plan_approved_message import PlanApprovedMessage
from core.modules.plans.agent_messages.plan_approval_note_message import PlanApprovalNoteMessage
from core.modules.plans.agent_messages.plan_waiting_message import PlanWaitingMessage
from core.modules.plans.agent_messages.plan_cancelled_message import PlanCancelledMessage
from core.modules.plans.agent_messages.plan_blocked_message import PlanBlockedMessage
from core.modules.plans.agent_messages.plan_opened_message import PlanOpenedMessage
from core.modules.plans.agent_messages.plan_context_message import PlanContextMessage
from core.modules.plans.agent_messages.unlinked_tasks_message import UnlinkedTasksMessage


PLAN_AGENT_MESSAGES = [UnlinkedTasksMessage, PlanFinishedMessage, PhaseFinishedMessage, CheckpointReachedMessage, CheckpointFinishedMessage, PlanStalledMessage, PlanApprovedMessage,
               PlanWaitingMessage, PlanApprovalNoteMessage, PlanCancelledMessage, PlanBlockedMessage, PlanOpenedMessage, PlanContextMessage, FocusSuggestedMessage,
               UnfocusedTaskMessage]
