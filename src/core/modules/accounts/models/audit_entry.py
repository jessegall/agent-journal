from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class AuditEntry(Model):
    """A line of what happened to a hosted journal's accounts, with where it came from."""

    model_name = "audit_entry"
    cli_name = "audit-entry"

    creator_id: int
    person_id: int | None = None
    event_type: str
    address: str
    device: str
    detail: str
