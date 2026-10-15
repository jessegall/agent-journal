from dataclasses import dataclass

from journal.models.actor import Actor

LOCAL_USER = 1


@dataclass(frozen=True)
class Where:
    """Where a command runs and who runs it: the environment's name, and the agent's session when an agent ran it."""

    environment: str = "main"
    session: str = ""
    from_agent_shell: bool = False
    """True inside an agent's own shell with no session named: the command is the environment's live agent's."""

    @property
    def actor(self) -> Actor:
        return Actor.agent(self.session) if self.session else Actor.user(LOCAL_USER)

    @classmethod
    def from_environ(cls, environ: dict) -> "Where":
        """What the supervisor sets for the agent, JOURNAL_ENV and JOURNAL_SESSION, and what the agent's shell carries, CLAUDECODE or CODEX_SANDBOX."""
        return cls(environ.get("JOURNAL_ENV", "main"), environ.get("JOURNAL_SESSION", ""), bool(environ.get("CLAUDECODE") or environ.get("CODEX_SANDBOX")))

    def as_(self, session: str) -> "Where":
        return Where(self.environment, session)
