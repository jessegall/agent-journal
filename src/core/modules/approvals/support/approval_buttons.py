from engine.viewer.button_condition import ButtonCondition
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType

APPROVAL_SLOT = (f"dock.{ApprovalDockType.REQUEST.value}", "row.approval")
OPEN_REQUEST = ButtonCondition("state", ("open",))
