from dataclasses import dataclass

from journal.models.actor import Actor

LOCAL_USER = 1

AGENT_SHELL = "JOURNAL_AGENT_SHELL"
"""Set by the journal in a worker's environment, so its journal commands are an agent's, never the user's."""


@dataclass(frozen=True)
class Where:
    """Where a command runs and who runs it: the environment's name, the agent's session when an agent ran it, and the plugin's name when a plugin's program did."""

    environment: str = "main"
    session: str = ""
    from_agent_shell: bool = False
    """True inside an agent's own shell with no session named: the command is the environment's live agent's."""
    plugin: str = ""

    @property
    def actor(self) -> Actor:
        if self.plugin:
            return Actor.plugin(self.plugin)
        return Actor.agent(self.session) if self.session else Actor.user(LOCAL_USER)

    @classmethod
    def from_environ(cls, environ: dict) -> "Where":
        return cls(environ.get("JOURNAL_ENV", "main"), environ.get("JOURNAL_SESSION", ""), bool(environ.get("CLAUDECODE") or environ.get("CODEX_SANDBOX") or environ.get(AGENT_SHELL)))

    def as_(self, session: str) -> "Where":
        return Where(self.environment, session)
