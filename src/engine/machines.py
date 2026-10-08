import json
import os
import uuid
from dataclasses import asdict, dataclass
from functools import cache
from pathlib import Path

from engine.stored import write_text
from resources.base import Refused

MACHINE_FILE = "machine-id"
LEASE = "lease.json"


def journal_home() -> Path:
    return Path(os.environ.get("AGENT_JOURNAL_HOME") or Path.home() / ".journal")


@cache
def this_machine() -> str:
    path = journal_home() / MACHINE_FILE
    if not path.is_file():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(uuid.uuid4().hex)
    return path.read_text().strip()


@dataclass(frozen=True)
class Lease:
    """Which machine writes a scope, and the epoch it took it in; a scope nobody leased is written by whoever holds its files."""

    machine: str = ""
    epoch: int = 0

    @classmethod
    def read(cls, folder: Path) -> "Lease":
        try:
            return cls(**json.loads((folder / LEASE).read_text()))
        except (OSError, ValueError, TypeError):
            return cls()

    def write(self, folder: Path) -> None:
        write_text(folder / LEASE, json.dumps(asdict(self)))

    def is_leased(self) -> bool:
        return bool(self.machine)

    def handed_to(self, machine: str) -> "Lease":
        return Lease(machine, self.epoch + 1)

    def holds(self, current: "Lease") -> bool:
        return not current.is_leased() or current == self


class ThisMachine:
    """The writer a record opened on this machine is: it holds every scope not leased to another machine."""

    def holds(self, current: Lease) -> bool:
        return not current.is_leased() or current.machine == this_machine()


MEMBER = "member"


class Pushing:
    """The writer a push is checked as: the machine its connection belongs to, which may write only a scope leased to it, never one nobody leased."""

    def __init__(self, machine: str) -> None:
        self.machine = machine

    def holds(self, current: Lease) -> bool:
        return current.is_leased() and current.machine == self.machine

    def attributed(self, data: dict) -> dict:
        """A pushed row or event with its member set from the connection, whatever the row itself says."""
        return {**data, MEMBER: self.machine}


class NotTheOwner(Refused):
    @classmethod
    def of(cls, scope: str, current: Lease) -> "NotTheOwner":
        return cls(f"{scope} is written by machine {current.machine} since its handover {current.epoch}; this write from a machine that no longer holds it was refused")
