from dataclasses import dataclass


@dataclass(frozen=True)
class SavedPlace:
    """What the journal keeps of its web address: its name on the tunler server, the share server's port, the tunnel inspector's port and the port and name the running tunnel was started for; 0 and empty before each is first chosen."""

    subdomain: str = ""
    port: int = 0
    inspector: int = 0
    tunnel: tuple = ()

    @classmethod
    def parsed(cls, data: dict) -> "SavedPlace":
        default = cls()
        return cls(str(data.get("subdomain", default.subdomain)), int(data.get("port", default.port)), int(data.get("inspector", default.inspector)), tuple(data.get("tunnel", default.tunnel)))
