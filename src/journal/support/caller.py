from dataclasses import dataclass

from journal.support.actor import Actor
from journal.support.rejection import Rejection

LOCAL_USER = 1

AGENT_SHELL = "JOURNAL_AGENT_SHELL"
WORKER = "JOURNAL_WORKER"

AGENT_REQUIRED = "no agent runs this: only an agent's own session can"


@dataclass(frozen=True)
class Caller:
    """Where a command runs and who runs it: the user, an agent by its session and provider, an agent's shell that names no session, a plugin by its name, or a worker by its number, its session when its program names one, and its provider."""

    environment: str
    session: str | None = None
    provider: str | None = None
    plugin_name: str | None = None
    worker_number: int | None = None

    @classmethod
    def user(cls, environment: str) -> "Caller":
        return cls(environment)

    @classmethod
    def agent(cls, environment: str, session: str, provider: str) -> "Caller":
        return cls(environment, session, provider)

    @classmethod
    def shell(cls, environment: str, provider: str) -> "Caller":
        return cls(environment, provider=provider)

    @classmethod
    def plugin(cls, environment: str, name: str) -> "Caller":
        return cls(environment, plugin_name=name)

    @classmethod
    def worker(cls, environment: str, number: int, session: str | None, provider: str) -> "Caller":
        return cls(environment, session, provider, worker_number=number)

    @property
    def actor(self) -> Actor:
        if self.plugin_name is not None:
            return Actor.plugin(self.plugin_name)
        if self.worker_number is not None:
            return Actor.worker(self.worker_number)
        return Actor.user(LOCAL_USER) if self.session is None else Actor.agent(self.session)

    @property
    def agent_session(self) -> str:
        if self.session is None:
            raise Rejection(AGENT_REQUIRED)
        return self.session

    @property
    def agent_provider(self) -> str:
        if self.provider is None:
            raise Rejection(AGENT_REQUIRED)
        return self.provider

    def is_unnamed_agent(self) -> bool:
        return self.provider is not None and self.session is None and self.worker_number is None
