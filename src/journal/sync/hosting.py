from journal.config import Config

HOSTED_FILE = "hosted"


class Hosting:
    """Whether this journal is the team server's own, hosted for the team's browsers: a mark only the team image writes, .journal/hosted, so no person's own journal can be switched into it from the viewer."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def is_hosted(self) -> bool:
        return (self.config.home / HOSTED_FILE).is_file()
