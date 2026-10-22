from collections.abc import Mapping
from dataclasses import dataclass, replace

from journal.support.caller import ACTOR, AGENT_SHELL, WORKER, WORKER_ACTOR, WORKER_TOKEN, Caller


@dataclass(frozen=True)
class CallerVariables:
    """What a shell's variables say about who runs a command in it, as the shim posts them: the environment, the provider whose marks are set, whether the shell is an agent's, the agent's session, the plugin and its token, the worker and the launch the shell runs under."""

    environment: str
    provider: str
    agent_shell: bool
    session: str | None = None
    plugin: str | None = None
    token: str | None = None
    worker: int | None = None
    launch: str | None = None
    worker_token: str | None = None
    worker_shell: bool = False

    @classmethod
    def read(cls, environ: Mapping[str, str], provider: str, session_variables: tuple[str, ...], markers: tuple[str, ...]) -> "CallerVariables":
        set_variables = {name: value for name, value in environ.items() if value}
        session = next((set_variables[name] for name in ("JOURNAL_SESSION", *session_variables) if name in set_variables), None)
        worker = set_variables.get(WORKER)
        return cls(set_variables.get("JOURNAL_ENV", "main"), provider, any(name in set_variables for name in (*markers, AGENT_SHELL)), session,
                   set_variables.get("JOURNAL_PLUGIN"), set_variables.get("JOURNAL_PLUGIN_TOKEN"), None if worker is None else int(worker), set_variables.get("JOURNAL_LAUNCH"),
                   set_variables.get(WORKER_TOKEN), set_variables.get(ACTOR) == WORKER_ACTOR)

    @classmethod
    def parsed(cls, body: dict, provider: str) -> "CallerVariables":
        fields = {key: value for key, value in body.items() if value not in ("", None)}
        return cls(fields.get("env", "main"), fields.get("provider", provider), bool(fields.get("agent")), fields.get("session"), fields.get("plugin"), fields.get("token"), fields.get("worker"), fields.get("launch"),
                   fields.get("worker_token"), bool(fields.get("worker_shell")))

    def body(self) -> dict:
        return {"env": self.environment, "provider": self.provider, "agent": self.agent_shell, "session": self.session, "plugin": self.plugin, "token": self.token, "worker": self.worker, "launch": self.launch,
                "worker_token": self.worker_token, "worker_shell": self.worker_shell}

    def caller(self, person: int) -> Caller:
        return replace(self.kind_caller(), person=person)

    def kind_caller(self) -> Caller:
        if self.plugin is not None:
            return Caller.plugin(self.environment, self.plugin)
        if self.worker is not None:
            return Caller.worker(self.environment, self.worker, self.session, self.provider)
        if self.session is not None:
            return Caller.agent(self.environment, self.session, self.provider)
        return Caller.shell(self.environment, self.provider) if self.agent_shell else Caller.user(self.environment)
