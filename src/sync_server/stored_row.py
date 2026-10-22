from dataclasses import dataclass, field


@dataclass(frozen=True)
class StoredRow:
    """A row as the server holds it now: each field's value, when it was changed, and the account that changed it."""

    fields: dict = field(default_factory=dict)
    changed_at: dict = field(default_factory=dict)
    writers: dict = field(default_factory=dict)
