import json
import os

from journal.config import Config
from journal.support.caller import LOCAL_USER

TEAM_FILE = "team.json"


class TeamAccount:
    """This journal's place in a team: whether it has joined one and which device of the team this machine is, and whether it holds the team's upgrade, read from the file the join writes beside the database."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_joined(self) -> bool:
        return (self.config.home / TEAM_FILE).is_file()

    def device(self) -> str:
        return str(self.contents().get("device", ""))

    def is_seed_writer(self) -> bool:
        return not self.is_joined() or bool(self.contents().get("upgrade", False))

    def address(self) -> str:
        return self.contents().get("address", "")

    def token(self) -> str:
        return self.contents().get("token", "")

    def sequence(self) -> int:
        return int(self.contents().get("sequence", 0))

    def record_sequence(self, sequence: int) -> None:
        self.write({**self.contents(), "sequence": sequence})

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
