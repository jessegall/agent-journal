import hashlib
import json
import os
import ssl
import re
import socket
from pathlib import Path

from journal.config import Config
from journal.support.actor import Actor
from journal.support.caller import LOCAL_USER
from journal.support.release import Release
from sync_server.account import ADMIN

TEAM_FILE = "team.json"
ROOT_FILE = "team-root.crt"
PREFIX_FILE = "team-prefix"


class TeamAccount:
    """This journal's place in a team: whether it has joined one and which device of the team this machine is, and whether it holds the team's upgrade, read from the file the join writes beside the database."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_joined(self) -> bool:
        return (self.config.home / TEAM_FILE).is_file()

    def device(self) -> str:
        return str(self.contents().get("device", ""))

    def is_seed_writer(self) -> bool:
        return not self.is_joined() or self.is_upgrader()

    def is_upgrader(self) -> bool:
        return bool(self.contents().get("upgrade", False))

    def address(self) -> str:
        return self.contents().get("address", "")

    def token(self) -> str:
        return self.contents().get("token", "")

    def sequence(self) -> int:
        return int(self.contents().get("sequence", 0))

    def record_sequence(self, sequence: int) -> None:
        self.write({**self.contents(), "sequence": sequence})

    def record_pull(self, sequence: int, team_version: str) -> None:
        self.write({**self.contents(), "sequence": sequence, "team_version": team_version})

    def team_version(self) -> str:
        return str(self.contents().get("team_version", ""))

    def allows(self, release: Release) -> bool:
        return not self.is_joined() or release.version == self.team_version()

    def write(self, contents: dict) -> None:
        path = self.config.home / TEAM_FILE
        draft = path.with_suffix(".draft")
        draft.write_text(json.dumps(contents))
        os.chmod(draft, 0o600)
        draft.replace(path)

    def contents(self) -> dict:
        return json.loads((self.config.home / TEAM_FILE).read_text()) if self.is_joined() else {}

    def user_number(self) -> int:
        return int(self.contents().get("account_id", LOCAL_USER))

    def root_path(self) -> Path:
        return self.config.home / ROOT_FILE

    def fingerprint(self) -> str:
        root = self.root_path()
        return hashlib.sha256(ssl.PEM_cert_to_DER_cert(root.read_text())).hexdigest() if root.is_file() else ""

    def join_line(self, code: str) -> str:
        fingerprint = self.fingerprint()
        return f"journal team join {self.address()} --code {code}{f' --fingerprint {fingerprint}' if fingerprint else ''}"

    def device_name(self) -> str:
        return socket.gethostname()

    def phone_actor(self, phone_id: int) -> Actor:
        return Actor.user(self.user_number()) if self.is_joined() else Actor.phone(phone_id)

    def write_prefix(self, name: str) -> str:
        prefix = re.sub(r"[^a-z0-9]+", "-", name.split()[0].lower() if name.split() else "").strip("-") or f"user{self.user_number()}"
        (self.config.home / PREFIX_FILE).write_text(prefix)
        return prefix

    def personal_name(self, name: str) -> str:
        prefix_file = self.config.home / PREFIX_FILE
        prefix = prefix_file.read_text().strip() if prefix_file.is_file() else ""
        return f"{prefix}-{name}" if prefix and not name.startswith(f"{prefix}-") else name

    def is_admin(self) -> bool:
        return self.contents().get("role") == ADMIN

    def is_chat_holder(self) -> bool:
        return bool(self.contents().get("holds_chat", False))
