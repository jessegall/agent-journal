from core.base.type_guards import is_mapping
import json
import os
from pathlib import Path


class SessionFile:
    """The sessions of people the viewer's login opened, token to person, kept in a file only its owner reads,
    so a browser stays logged in when the server restarts."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def load(self) -> dict[str, int]:
        if not self.path.is_file():
            return {}
        try:
            kept: object = json.loads(self.path.read_text())
        except ValueError:
            return {}
        return {str(token): person for token, person in kept.items() if isinstance(person, int)} if is_mapping(kept) else {}

    def save(self, sessions: dict[str, int]) -> None:
        descriptor = os.open(self.path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(descriptor, "w") as file:
            file.write(json.dumps(sessions))
