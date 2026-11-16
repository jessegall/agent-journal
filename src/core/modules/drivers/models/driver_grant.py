from dataclasses import dataclass

from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class DriverGrant(EnvironmentScoped, Model):
    """A one-use exception a policy reads, for the grants that have no table of their own today (the alias
    skip): the policy, the agent, the exact target and action, its state, who asked and answered, and the
    event id that spent it."""

    model_name = "driver_grant"
    cli_name = "driver-grant"

    session_agent_id: int
    environment_id: int = 0
    grant_type: GrantType
    policy_key: str
    target: str
    action_fingerprint: str
    asker_id: int
    reason: str
    grant_state: GrantState = GrantState.HELD
    responder_id: int | None = None
    tried: str = ""
    expires_at: Timestamp | None = None
    spending_event_id: str = ""
