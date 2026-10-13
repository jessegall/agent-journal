"""A service the journal keeps running for a feature: how it is declared, and the states it passes through."""

from dataclasses import dataclass, field, fields

GRACE = 5.0
STARTING, READY, STOPPED, EXITED = "starting", "ready", "stopped", "exited"
BUILD = "JOURNAL_BUILD"


def known(cls, raw: dict) -> dict:
    return {f.name: raw[f.name] for f in fields(cls) if f.name in raw}


@dataclass(frozen=True)
class ServiceSpec:
    id: str
    plugin: str
    service: str
    run: object
    lock: str
    log: str
    status: str
    spec: str
    port: int = 0
    blocked: str = ""
    cwd: str = ""
    env: dict = field(default_factory=dict)
    path: str = ""
    restart: str = "on-failure"
    grace: float = GRACE
    show: dict = field(default_factory=dict)
    url: str = ""
    owner: int = 0
    when: str = ""
    idle: str = ""

    @classmethod
    def from_json(cls, raw: dict) -> "ServiceSpec":
        return cls(**known(cls, raw))

    @property
    def build(self) -> str:
        return self.env.get(BUILD, "")
