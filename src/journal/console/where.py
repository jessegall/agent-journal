from dataclasses import dataclass

from journal.models.actor import Actor

LOCAL_USER = 1


@dataclass(frozen=True)
class Where:
    """Where a command runs and who runs it: the environment's name, and the agent's session when an agent ran it."""

    environment: str = "main"
    session: str = ""

    @property
    def actor(self) -> Actor:
        return Actor.agent(self.session) if self.session else Actor.user(LOCAL_USER)

    @classmethod
    def from_environ(cls, environ: dict) -> "Where":
        """What the supervisor sets for the agent: JOURNAL_ENV and JOURNAL_SESSION."""
        return cls(environ.get("JOURNAL_ENV", "main"), environ.get("JOURNAL_SESSION", ""))
