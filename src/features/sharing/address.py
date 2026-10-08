from dataclasses import asdict, dataclass

from engine.extension import Extension
from engine.record import Record
from engine.machines import this_machine

RELIED_ON = Extension()
ANSWERS_AT = Extension()


@dataclass(frozen=True)
class Claim:
    machine: str
    account: str
    host: str

    @classmethod
    def kept(cls, kept: dict) -> "Claim":
        return cls(kept.get("machine", ""), kept.get("account", ""), kept.get("host", ""))

    def fields(self) -> dict:
        return asdict(self)

    def is_elsewhere(self, other: "Claim") -> bool:
        return bool(self.machine) and self.machine != other.machine


def relied_on(record: Record) -> bool:
    return any(depends(record.root) for depends in RELIED_ON.each(record))


def own_address(record: Record) -> list[str]:
    """The address a feature gives the journal in place of a tunnel, such as the domain of a journal on a server."""
    return [found for given in ANSWERS_AT.each(record) if (found := given(record))]
