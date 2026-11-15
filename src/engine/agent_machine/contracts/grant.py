from dataclasses import dataclass
from datetime import datetime

from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType


@dataclass(frozen=True)
class Grant:
    """A one-use exception a policy reads: the policy it passes, for which agent, target and action, where it
    stands, who asked and answered, and the firing that spent it."""

    grant_id: int
    grant_type: GrantType
    policy_key: str
    agent_id: int
    environment_id: int
    target: str
    action_fingerprint: str
    grant_state: GrantState
    asker_id: int
    responder_id: int | None
    reason: str
    tried: str = ""
    expires_at: datetime | None = None
    spending_firing: str = ""

    def is_usable(self) -> bool:
        return self.grant_state in (GrantState.CONFIRMED, GrantState.APPROVED)

    def passes(self, policy_key: str, action_fingerprint: str) -> bool:
        return self.is_usable() and (self.policy_key, self.action_fingerprint) == (policy_key, action_fingerprint)
