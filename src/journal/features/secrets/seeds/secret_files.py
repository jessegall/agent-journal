import json
from datetime import datetime, timezone
from pathlib import Path

from journal.config import Config
from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.repositories.secrets import Secrets


class SecretFiles(Seed):
    """At boot, each secret kept as a file under the journal's project/secret folder becomes a row, once: its fields, which are filled, its programs and its login; the values stay in the private folder under the same project id, so they open as they are."""

    def __init__(self, config: Config, secrets: Secrets) -> None:
        self.config, self.secrets = config, secrets

    def run(self) -> None:
        known = {s.title.lower() for s in self.secrets.all()}
        for path in sorted((self.config.home / "project" / "secret").glob("*.md")):
            secret = self.read(path)
            if secret is not None and secret.title.lower() not in known:
                self.secrets.save(secret, Actor.system())
                known.add(secret.title.lower())

    def read(self, path: Path) -> Secret | None:
        """The row a secret file holds: a JSON head between two --- lines, how it is used after them; a file not shaped so is none."""
        parts = path.read_text().split("---\n", 2)
        if len(parts) < 3:
            return None
        head, brief = json.loads(parts[1]), parts[2].strip()
        data = head.get("data", {})
        return Secret(title=head.get("title", path.stem), brief=brief, kind=SecretKind.named(data.get("kind") or SecretKind.CUSTOM.value),
                      fields=tuple(data.get("secret_fields", ())), filled=tuple(data.get("filled", {})), programs=tuple(data.get("programs", ())),
                      proposed=tuple(data.get("proposed", ())), helpers=bool(data.get("helpers")), url=data.get("url", ""), auto_login=bool(data.get("auto_login")),
                      used_at=self.at(data.get("used")), session_at=self.at(data.get("session")), session_expires=self.at(data.get("session_expires")),
                      deleted_at=self.at(head.get("deleted")))

    @staticmethod
    def at(stamp) -> datetime | None:
        return datetime.fromtimestamp(stamp, timezone.utc) if stamp else None
