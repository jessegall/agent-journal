from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle


@dataclass(frozen=True, kw_only=True)
class ApprovalRequest(EnvironmentScoped, Model):
    """An action waiting for a person's decision in an environment's dock; command_json is the command Accept runs as
    the person, when the approval names one."""

    model_name = "approval"
    cli_name = "approval"
    lifecycle = ApprovalLifecycle

    environment_id: int = 0
    creator_id: int
    requester_id: int
    required_person_id: int | None = None
    recipient_agent_id: int | None = None
    relayed_by_id: int | None = None
    answered_by_id: int | None = None
    review_answer: str = ""
    source_version: int | None = None
    returns_output: bool = False
    text: str
    why: str = ""
    arguments: tuple[str, ...]
    refused_arguments: tuple[str, ...] = ()
    continued_arguments: tuple[str, ...] = ()
    command_json: str = ""
    standing_id: int | None = None
    state: ApprovalState = ApprovalState.OPEN
