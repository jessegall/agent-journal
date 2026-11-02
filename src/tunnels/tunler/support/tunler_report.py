import json
from dataclasses import dataclass
from typing import Self


@dataclass(frozen=True)
class TunlerReport:
    """What the tunler program printed for --json: its login and its version; a line that is no JSON object
    is an empty report."""

    logged_in: bool = False
    auth_ok: bool | None = None
    user: str | None = None
    host: str | None = None
    current: str | None = None
    latest: str | None = None
    update_available: bool | None = None

    @classmethod
    def from_text(cls, text: str) -> Self:
        try:
            fields = json.loads(text)
        except ValueError:
            return cls()
        if not isinstance(fields, dict):
            return cls()
        texts = {name: value if isinstance(value := fields.get(name), str) and value else None for name in ("user", "host", "current", "latest")}
        flags = {name: value if isinstance(value := fields.get(name), bool) else None for name in ("auth_ok", "update_available")}
        return cls(logged_in=fields.get("logged_in") is True, **texts, **flags)
