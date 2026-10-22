from journal.models.environment import Environment
from journal.repositories.environments import Environments
from journal.sync.team_account import TeamAccount


class EnvironmentNames:
    """The environment a name a shell, a hook or a command sends stands for: the one of that name, else, on a joined journal, the person's own of that name, as main stands for jesse-main for a session started before the journal joined its team; one is made under the person's name when neither is there."""

    def __init__(self, environments: Environments, account: TeamAccount) -> None:
        self.environments, self.account = environments, account

    def resolved(self, name: str) -> Environment:
        matches = self.environments.matching(name=name)
        return matches[0] if matches else self.environments.lookup(self.account.personal_name(name))
