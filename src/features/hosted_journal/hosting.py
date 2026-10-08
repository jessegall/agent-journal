from dataclasses import dataclass
from enum import Enum

from resources.fields import Loaded
from engine.disk import read_json
from engine.version import version
from features.hosted_journal.vault import Vault

REQUEST = "hosting-request.json"
UPDATER_FOLDER = "updater"
STATUS = "status.json"
DOWN = "down"


class Ask(Enum):
    UPGRADE = "upgrade"
    TAKE_DOWN = "take-down"


@dataclass(frozen=True)
class KeptRequest(Loaded):
    asked: str = ""
    at: float = 0.0


@dataclass(frozen=True)
class UpdaterStatus(Loaded):
    """What the updater last verified: the newest version signed by the release workflow, and the one running now."""

    latest: str = ""
    newer: bool = False


@dataclass(frozen=True)
class HostingStatus:
    installed: str
    latest: str
    newer: bool


class Hosting:
    """The owner's upgrade and take-down, handed to the updater beside the journal, which alone may run docker."""

    def __init__(self, vault: Vault) -> None:
        self.vault = vault
        self.updater = vault.base.with_name(UPDATER_FOLDER)

    def status(self) -> HostingStatus:
        kept = UpdaterStatus.from_json(read_json(self.updater / STATUS, dict, {}))
        installed = version()
        return HostingStatus(installed, kept.latest or installed, kept.newer)

    def ask(self, what: Ask) -> None:
        self.vault.write(REQUEST, {"asked": what.value, "at": self.vault.clock()})
        self.vault.audit(f"asked the updater to {what.value}")

    def down(self) -> bool:
        asked = KeptRequest.from_json(self.vault.read(REQUEST))
        return (self.updater / DOWN).exists() or asked.asked == Ask.TAKE_DOWN.value
