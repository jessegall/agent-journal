import json
from dataclasses import dataclass
from typing import Self

from engine.types.type_guards import is_mapping


@dataclass(frozen=True)
class TunlerReport:
    """What the tunler program printed for --json: its login and its version; a line that is no JSON object
    is an empty report."""

    has_login: bool = False
    auth_accepted: bool | None = None
    user: str | None = None
    host: str | None = None
    current: str | None = None
    latest: str | None = None
    update_available: bool | None = None

    @classmethod
    def parsed(cls, text: str) -> Self:
        try:
            fields = json.loads(text)
        except ValueError:
            return cls()
        if not is_mapping(fields):
            return cls()
        texts = {name: value if isinstance(value := fields.get(name), str) and value else None for name in ("user", "host", "current", "latest")}
        update_available = fields.get("update_available")
        auth_accepted = fields.get("auth_ok")
        return cls(has_login=fields.get("logged_in") is True, auth_accepted=auth_accepted if isinstance(auth_accepted, bool) else None,
                   update_available=update_available if isinstance(update_available, bool) else None, **texts)
