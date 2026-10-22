import json

from journal.config import Config

TEAM_FILE = "team.json"


class TeamAccount:
    """This journal's place in a team: whether it has joined one and which device of the team this machine is, and whether it holds the team's upgrade, read from the file the join writes beside the database."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_joined(self) -> bool:
        return (self.config.home / TEAM_FILE).is_file()

    def device(self) -> str:
        return json.loads((self.config.home / TEAM_FILE).read_text()).get("device", "") if self.is_joined() else ""

    def is_seed_writer(self) -> bool:
        return not self.is_joined() or json.loads((self.config.home / TEAM_FILE).read_text()).get("upgrade", False)
