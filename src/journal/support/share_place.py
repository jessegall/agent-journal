import json
import re
import secrets
from dataclasses import asdict, replace

from journal.config import Config
from journal.features.sharing.support.kept_place import KeptPlace

NAME_BYTES = 12
PREFIX_LETTERS = 20


class SharePlace:
    """Where the outside reaches this journal, kept in its home so a restart keeps it: the tunnel's subdomain, the share server's port and what the tunnel was started for."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.path = config.home / "sharing.json"

    def kept(self) -> KeptPlace:
        if not self.path.is_file():
            return KeptPlace()
        try:
            data = json.loads(self.path.read_text())
        except ValueError:
            return KeptPlace()
        return KeptPlace.from_json(data) if isinstance(data, dict) else KeptPlace()

    def keep(self, **fields) -> None:
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(asdict(replace(self.kept(), **fields))))

    def subdomain(self) -> str:
        return self.kept().subdomain or self.new_subdomain()

    def new_subdomain(self) -> str:
        prefix = re.sub(r"[^a-z0-9]+", "-", self.config.root.name.lower()).strip("-")[:PREFIX_LETTERS].strip("-") or "journal"
        name = f"{prefix}-{secrets.token_hex(NAME_BYTES)}"
        self.keep(subdomain=name)
        return name
