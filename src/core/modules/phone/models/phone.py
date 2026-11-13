import json
from dataclasses import dataclass

from engine.model.model import Model
from engine.types.type_guards import is_mapping
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.lifecycles.phone_lifecycle import PhoneLifecycle


@dataclass(frozen=True, kw_only=True)
class Phone(Model):
    """A phone a user paired, which opens the viewer as that user until it is unpaired; it keeps only the
    digest of its session token, never the token, and the push subscription it gave, if any."""

    model_name = "phone"
    cli_name = "phone"
    search_fields = ["name"]
    lifecycle = PhoneLifecycle
    hidden_fields = frozenset({"token_digest", "subscription"})

    creator_id: int
    person_id: int
    name: str
    token_digest: str
    state: PhoneState = PhoneState.PAIRED
    subscription: str | None = None
    notice_waiting: bool = False

    @property
    def endpoint(self) -> str | None:
        parsed: object = json.loads(self.subscription) if self.subscription is not None else None
        endpoint = parsed.get("endpoint") if is_mapping(parsed) else None
        return endpoint if isinstance(endpoint, str) else None
