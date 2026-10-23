from journal.models.environment import Environment
from journal.repositories.environment_owners import EnvironmentOwners
from journal.sync.hosting import Hosting
from journal.sync.team_chat import TeamChat

HOSTED_REFUSAL = "this journal is hosted for the team's browsers; agents run on a member's own journal"


class StartRule:
    """Whether an agent may start here: never on a hosted journal, never in a colleague's environment, and in the Team chat only on the machine that holds it."""

    def __init__(self, hosting: Hosting, owners: EnvironmentOwners, chat: TeamChat) -> None:
        self.hosting, self.owners, self.chat = hosting, owners, chat

    def refusal(self, environment: Environment, person: int) -> str:
        return self.hosted_refusal() or self.owners.start_refusal(environment, person) or self.chat.start_refusal(environment)

    def hosted_refusal(self) -> str:
        return HOSTED_REFUSAL if self.hosting.is_hosted() else ""
