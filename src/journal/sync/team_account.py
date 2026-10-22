import json

from journal.config import Config

TEAM_FILE = "team.json"


class TeamAccount:
    """This journal's place in a team: whether it has joined one and which device of the team this machine is, read from the file the join writes beside the database."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_joined(self) -> bool:
        return (self.config.home / TEAM_FILE).is_file()

    def device(self) -> str:
        return json.loads((self.config.home / TEAM_FILE).read_text()).get("device", "") if self.is_joined() else ""
