from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.drivers.models.enums.permission_state import PermissionState


class PermissionLifecycle(Lifecycle):
    states = PermissionState
    initial = [PermissionState.REQUESTED]
    editable = ()
    deletable = ()

    allow = Move("allow", [PermissionState.REQUESTED], PermissionState.ALLOWED)
    decline = Move("decline", [PermissionState.REQUESTED], PermissionState.DECLINED)
    use = Move("use", [PermissionState.ALLOWED], PermissionState.USED)
