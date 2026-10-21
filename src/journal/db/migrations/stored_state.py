from dataclasses import dataclass, replace

from journal.db.migrations.unwrap_outcome import UnwrapOutcome


@dataclass(frozen=True)
class StoredState:
    """A state as an agent's row held it before the pauses were unwrapped: its name, its own data, and the state it went back to, nested."""

    name: str
    data: dict
    resume: "StoredState | None" = None

    @classmethod
    def from_json(cls, name: str, data: dict) -> "StoredState":
        resume = data.get("resume")
        own = {key: value for key, value in data.items() if key != "resume"}
        return cls(name, own, cls.from_json(resume.get("state", "idle"), resume.get("data") or {}) if resume else None)

    def to_json(self) -> dict:
        return {**self.data, "resume": {"state": self.resume.name, "data": self.resume.to_json()}} if self.resume else self.data

    def resumed(self) -> "StoredState":
        return self.resume or StoredState("idle", {})

    def without(self, name: str) -> UnwrapOutcome:
        inner = self.resume.without(name) if self.resume else UnwrapOutcome(StoredState("idle", {}), ())
        if self.name == name:
            return UnwrapOutcome(inner.state, (*inner.taken, self))
        return UnwrapOutcome(replace(self, resume=inner.state) if self.resume else self, inner.taken)
