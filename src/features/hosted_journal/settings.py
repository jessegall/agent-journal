from dataclasses import dataclass
from pathlib import Path

from engine.fields import Loaded
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.vault import Vault

GATEWAY = "gateway.json"


@dataclass(frozen=True)
class GatewaySettings(Loaded):
    """What the login page answers by: its address, the proxy it trusts and how long a login lasts."""

    address: str = ""
    proxy: str = ""
    days: int = 7


class FromRecord:
    """The login page's settings as the journal's record holds them, for a login page the journal runs itself."""

    def of(self, record) -> GatewaySettings:
        values = HostedJournalDetails.values(record)
        return GatewaySettings(values["address"], values["proxy"], int(values["days"]))


class FromVault:
    """The login page's settings as only its own user can write them, read once when it starts, for a login page run apart."""

    def __init__(self) -> None:
        self.kept: dict[Path, GatewaySettings] = {}

    def of(self, record) -> GatewaySettings:
        if record.root not in self.kept:
            self.kept[record.root] = GatewaySettings.from_json(Vault(record.root).read(GATEWAY))
        return self.kept[record.root]


def keep_gateway_settings(root: Path, settings: GatewaySettings) -> None:
    Vault(root).write(GATEWAY, {"address": settings.address, "proxy": settings.proxy, "days": settings.days})
