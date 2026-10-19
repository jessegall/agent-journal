from dataclasses import dataclass


@dataclass(frozen=True)
class DumpItem:
    """One piece of a dump, a pasted text or a dropped file, and where the agent has taken it: read, filed or failed."""

    insight: str = ""
    outcome: str = ""
    failed: str = ""
    refs: tuple[str, ...] = ()
    added: tuple[str, ...] = ()

    @classmethod
    def of(cls, raw: dict) -> "DumpItem":
        return cls(raw.get("insight", ""), raw.get("outcome", ""), raw.get("failed", ""), tuple(raw.get("refs") or ()), tuple(raw.get("added") or ()))

    def to_json(self) -> dict:
        return {"insight": self.insight, "outcome": self.outcome, "failed": self.failed, "refs": list(self.refs), "added": list(self.added)}

    @property
    def settled(self) -> bool:
        return bool(self.outcome or self.failed)

    @property
    def standing(self) -> str:
        if self.failed:
            return f"failed - {self.failed}"
        if self.outcome:
            return f"filed - {self.outcome}"
        return f"noted - {self.insight}" if self.insight else "not read yet"
