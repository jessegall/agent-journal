from dataclasses import dataclass

from engine.agent_machine.stepping.grant import NEXT_ACTION
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp

ANY_TARGET = ""


@dataclass(frozen=True, kw_only=True)
class DriverGrant(EnvironmentScoped, Model):
    """A one-use exception a policy reads, of every kind (a refusal or guard skip, an alias skip, a
    permission): the policy, the agent, the exact target and action, its state, who asked and answered,
    how many refusals in a row a skip passed, the times it was confirmed, approved and restored, whether a
    person must approve it, and the event id that spent it."""

    model_name = "driver_grant"
    cli_name = "driver-grant"

    session_agent_id: int
    environment_id: int = 0
    grant_type: GrantType
    policy_key: str
    target: str = ANY_TARGET
    action_fingerprint: str = NEXT_ACTION
    asker_id: int
    reason: str
    grant_state: GrantState = GrantState.OPEN
    responder_id: int | None = None
    tried: str = ""
    expires_at: Timestamp | None = None
    spending_event_id: str = ""
    consecutive_skips: int = 1
    requires_approval: bool = False
    confirmed_at: Timestamp | None = None
    approved_at: Timestamp | None = None
    restored_at: Timestamp | None = None

    # a skip is answered once its agent confirmed or withdrew it; either answer is final
    @property
    def is_answered(self) -> bool:
        return self.confirmed_at is not None or self.grant_state is GrantState.REVOKED
