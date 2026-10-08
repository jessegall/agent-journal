import uuid
from dataclasses import asdict, dataclass
from functools import cache

from engine.extension import Extension
from engine.record import Record
from engine.viewer import machine

RELIED_ON = Extension()
ANSWERS_AT = Extension()
MACHINE_FILE = "machine-id"


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


@cache
def this_machine() -> str:
    path = machine().with_name(MACHINE_FILE)
    if not path.is_file():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(uuid.uuid4().hex)
    return path.read_text().strip()


def relied_on(record: Record) -> bool:
    return any(depends(record.root) for depends in RELIED_ON.each(record))


def own_address(record: Record) -> list[str]:
    """The address a feature gives the journal in place of a tunnel, such as the domain of a journal on a server."""
    return [found for given in ANSWERS_AT.each(record) if (found := given(record))]
