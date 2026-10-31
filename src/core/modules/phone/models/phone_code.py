from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.phone.models.enums.phone_code_state import PhoneCodeState
from core.modules.phone.models.lifecycles.phone_code_lifecycle import PhoneCodeLifecycle


@dataclass(frozen=True, kw_only=True)
class PhoneCode(Model):
    """A short code a person asked for, which pairs one phone once before it expires; it keeps only the code's
    digest."""

    model_name = "phone_code"
    cli_name = "phone-code"
    lifecycle = PhoneCodeLifecycle

    creator_id: int
    person_id: int
    code_digest: str
    expires_at: Timestamp
    state: PhoneCodeState = PhoneCodeState.OPEN
