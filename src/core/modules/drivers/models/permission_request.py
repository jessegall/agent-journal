from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.lifecycles.permission_lifecycle import PermissionLifecycle


@dataclass(frozen=True, kw_only=True)
class PermissionRequest(EnvironmentScoped, Model):
    """One funnel for an agent that needs one thing it may not do: the command or file it names and why,
    answered once by the main agent of its environment, or by a user's dock card where the action needs
    one."""

    model_name = "permission_request"
    cli_name = "permission-request"
    lifecycle = PermissionLifecycle
    search_fields = ["action", "reason"]

    environment_id: int = 0
    asker_id: int
    action: str
    reason: str
    needs_person: bool = False
    responder_id: int | None = None
    state: PermissionState = PermissionState.REQUESTED
