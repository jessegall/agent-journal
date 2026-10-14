import os

from journal.models.actor import Actor
from journal.models.environment import Environment
from journal.repositories.environments import Environments

LOCAL_USER = 1


class Where:
    """Where a command runs and who runs it, read from the environment the supervisor sets: JOURNAL_ENV names the environment, JOURNAL_SESSION the agent."""

    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    def environment(self) -> Environment:
        return self.environments.named(os.environ.get("JOURNAL_ENV", "main"))

    def actor(self) -> Actor:
        session = os.environ.get("JOURNAL_SESSION", "")
        return Actor.agent(session) if session else Actor.user(LOCAL_USER)
