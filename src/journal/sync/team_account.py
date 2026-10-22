from journal.config import Config

TEAM_FILE = "team.json"


class TeamAccount:
    """This journal's place in a team: whether it has joined one, read from the file the join writes beside the database."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_joined(self) -> bool:
        return (self.config.home / TEAM_FILE).is_file()
