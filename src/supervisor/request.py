import os
from dataclasses import dataclass, field

from supervisor.band_words import BandWords


@dataclass(frozen=True)
class Request:
    """One request on the protocol, read from its line of JSON: the verb and what it carries."""

    verb: str
    name: str = ""
    command: tuple[str, ...] = ()
    folder: str = "."
    env: dict[str, str] = field(default_factory=dict)
    log: str = os.devnull
    keep: bool = True
    inherit: bool = True
    keys: str = ""
    line: str = ""
    after: float = 0.0
    data: str = ""
    resume: tuple[str, ...] = ()
    words: BandWords | None = None
    """The band's words, when the request carries them."""
    given: frozenset[str] = frozenset()
    """The fields the request carried, so a verb can say which one it lacks."""

    def needs(self, *fields: str) -> "Request":
        """The request itself, when it carries every field named; else it is refused with the first it lacks."""
        missing = [name for name in fields if name not in self.given]
        if missing:
            raise LookupError(f"{self.verb} needs {missing[0]!r}")
        return self

    @classmethod
    def from_json(cls, payload: dict) -> "Request":
        words = BandWords(str(payload["left"]), str(payload["middle"]), str(payload["right"])) if {"left", "middle", "right"} <= payload.keys() else None
        return cls(verb=str(payload.get("verb", "")), name=str(payload.get("name", "")), command=tuple(payload.get("command", ())), folder=str(payload.get("folder", ".")),
                   env=dict(payload.get("env", {})), log=str(payload.get("log", os.devnull)), keep=bool(payload.get("keep", True)), inherit=bool(payload.get("inherit", True)),
                   keys=str(payload.get("keys", "")), line=str(payload.get("line", "")), after=float(payload.get("after", 0)), data=str(payload.get("data", "")),
                   resume=tuple(payload.get("resume", ())), words=words, given=frozenset(payload))
