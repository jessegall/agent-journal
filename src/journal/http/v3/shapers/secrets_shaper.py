from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.repositories.secrets import Secrets


class SecretsShaper(Shaper):
    """A secret as the Secrets page reads it: its fields and which are filled, the programs it may go to and the login's times; never a value."""

    type = "secret"

    def __init__(self, secrets: Secrets) -> None:
        self.secrets = secrets

    def rows(self) -> list[V3Row]:
        return [self.row(s) for s in self.secrets.all()]

    def row(self, s) -> V3Row:
        filled_at = seconds(s.updated_at)
        return V3Row.of("secret", s, title=s.title, brief=s.brief, completed=seconds(s.deleted_at) if s.deleted_at else 0.0, data={
            "kind": s.kind.value, "secret_fields": [dict(raw) for raw in s.fields], "filled": {name: filled_at for name in s.filled},
            "programs": list(s.programs), "proposed": list(s.proposed), "helpers": s.helpers, "url": s.url, "auto_login": s.auto_login,
            "asked": "asked" if s.asked_at else "", "used": seconds(s.used_at), "session": seconds(s.session_at),
            "session_expires": seconds(s.session_expires), "logging_in": seconds(s.logging_in_at),
        })
