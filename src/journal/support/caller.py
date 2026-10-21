from dataclasses import dataclass

from journal.support.actor import Actor

LOCAL_USER = 1

AGENT_SHELL = "JOURNAL_AGENT_SHELL"


@dataclass(frozen=True)
class Caller:
    """Where a command runs and who runs it: the environment's name, the agent's session when an agent ran it, and the plugin's name when a plugin's program did."""

    environment: str = "main"
    session: str = ""
    from_agent_shell: bool = False
    plugin: str = ""

    @property
    def actor(self) -> Actor:
        if self.plugin:
            return Actor.plugin(self.plugin)
        return Actor.agent(self.session) if self.session else Actor.user(LOCAL_USER)

    @classmethod
    def environment_caller(cls, environ: dict) -> "Where":
        session = environ.get("JOURNAL_SESSION") or environ.get("CODEX_THREAD_ID", "")
        return cls(environ.get("JOURNAL_ENV", "main"), session, bool(environ.get("CLAUDECODE") or environ.get("CODEX_SANDBOX") or environ.get("CODEX_CI") or environ.get(AGENT_SHELL)), environ.get("JOURNAL_PLUGIN", ""))

    def as_(self, session: str) -> "Where":
        return Caller(self.environment, session)
