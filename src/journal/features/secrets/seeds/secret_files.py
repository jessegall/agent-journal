import json
from datetime import datetime, timezone
from pathlib import Path

from journal.config import Config
from journal.features.seed import Seed
from journal.support.actor import Actor
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.repositories.secrets import Secrets


class SecretFiles(Seed):
    """At boot, each secret kept as a file under the journal's project/secret folder becomes a row, once: its fields, which are filled, its programs and its login; the values stay in the private folder under the same project id, so they open as they are."""

    def __init__(self, config: Config, secrets: Secrets) -> None:
        self.config, self.secrets = config, secrets

    def run(self) -> None:
        existing = {s.title.lower() for s in self.secrets.all()}
        for path in sorted((self.config.home / "project" / "secret").glob("*.md")):
            secret = self.read(path)
            if secret is not None and secret.title.lower() not in existing:
                self.secrets.save(secret, Actor.system())
                existing.add(secret.title.lower())

    def read(self, path: Path) -> Secret | None:
        parts = path.read_text().split("---\n", 2)
        if len(parts) < 3:
            return None
        head, brief = json.loads(parts[1]), parts[2].strip()
        data = head.get("data", {})
        return Secret(title=head.get("title", path.stem), brief=brief, kind=SecretKind.lookup(data.get("kind") or SecretKind.CUSTOM.value),
                      fields=tuple(data.get("secret_fields", ())), filled=tuple(data.get("filled", {})), programs=tuple(data.get("programs", ())),
                      proposed=tuple(data.get("proposed", ())), helpers=bool(data.get("helpers")), url=data.get("url", ""), auto_login=bool(data.get("auto_login")),
                      used_at=self.time(data.get("used")), session_at=self.time(data.get("session")), session_expires=self.time(data.get("session_expires")),
                      deleted_at=self.time(head.get("deleted")))

    @staticmethod
    def time(stamp) -> datetime | None:
        return datetime.fromtimestamp(stamp, timezone.utc) if stamp else None
