from dataclasses import dataclass, fields


@dataclass(frozen=True)
class SavedPlace:
    """What the journal keeps of its web address: its name on the tunler server, the share server's port, the tunnel inspector's port and the port and name the running tunnel was started for; 0 and empty before each is first chosen."""

    subdomain: str = ""
    port: int = 0
    inspector: int = 0
    tunnel: tuple = ()

    @classmethod
    def parsed(cls, data: dict) -> "SavedPlace":
        known = {f.name for f in fields(cls)}
        return cls(**{name: tuple(value) if isinstance(value, list) else value for name, value in data.items() if name in known})
