from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.lifecycles.phone_lifecycle import PhoneLifecycle


@dataclass(frozen=True, kw_only=True)
class Phone(Model):
    """A phone a person paired, which opens the viewer as that person until it is unpaired; it keeps only the
    digest of its session token, never the token."""

    model_name = "phone"
    cli_name = "phone"
    lifecycle = PhoneLifecycle

    creator_id: int
    person_id: int
    name: str
    token_digest: str
    state: PhoneState = PhoneState.PAIRED
