import os
from dataclasses import dataclass, field

from supervisor.band_labels import BandLabels


@dataclass(frozen=True)
class Request:
    """One request on the protocol, read from its line of JSON: the verb and what it carries."""

    verb: str
    name: str = ""
    command: tuple[str, ...] = ()
    folder: str = "."
    environ: dict[str, str] = field(default_factory=dict)
    log: str = os.devnull
    persistent: bool = True
    inherit: bool = True
    keys: str = ""
    line: str = ""
    delay_seconds: float = 0.0
    data: str = ""
    resume: tuple[str, ...] = ()
    labels: BandLabels | None = None
    payload_keys: frozenset[str] = frozenset()

    def needs(self, *fields: str) -> "Request":
        missing = [name for name in fields if name not in self.payload_keys]
        if missing:
            raise LookupError(f"{self.verb} needs {missing[0]!r}")
        return self

    @classmethod
    def parsed(cls, payload: dict) -> "Request":
        labels = BandLabels.parsed(payload) if BandLabels.is_carried(payload) else None
        return cls(verb=str(payload.get("verb", "")), name=str(payload.get("name", "")), command=tuple(payload.get("command", ())), folder=str(payload.get("folder", ".")),
                   environ=dict(payload.get("env", {})), log=str(payload.get("log", os.devnull)), persistent=bool(payload.get("keep", True)), inherit=bool(payload.get("inherit", True)),
                   keys=str(payload.get("keys", "")), line=str(payload.get("line", "")), delay_seconds=float(payload.get("after", 0)), data=str(payload.get("data", "")),
                   resume=tuple(payload.get("resume", ())), labels=labels, payload_keys=frozenset(payload))
