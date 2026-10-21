from dataclasses import dataclass

from journal.support.actor import Actor

LOCAL_USER = 1

AGENT_SHELL = "JOURNAL_AGENT_SHELL"
WORKER = "JOURNAL_WORKER"


@dataclass(frozen=True)
class Caller:
    """Where a command runs and who runs it: the environment's name, the agent's session when an agent ran it, the plugin's name when a plugin's program did, and the worker's number when a worker did."""

    environment: str = "main"
    session: str = ""
    agent_shell: bool = False
    plugin: str = ""
    worker: int = 0

    @property
    def actor(self) -> Actor:
        if self.plugin:
            return Actor.plugin(self.plugin)
        if self.worker:
            return Actor.worker(self.worker)
        return Actor.agent(self.session) if self.session else Actor.user(LOCAL_USER)

    def as_(self, session: str) -> "Caller":
        return Caller(self.environment, session)
