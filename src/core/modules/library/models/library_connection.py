from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.library.models.enums.library_role import LibraryRole


@dataclass(frozen=True, kw_only=True)
class LibraryConnection(Model):
    """This journal's connection to a team's shared server: the address a person connected to, which is the only
    place the token goes, the user and role the server gave, and why sync stopped, if it did."""

    model_name = "library_connection"
    cli_name = "library-connection"

    creator_id: int
    server_key: str
    address: str
    name: str
    user_name: str = ""
    role: LibraryRole = LibraryRole.READ
    reached_at: Timestamp | None = None
    failure: str = ""
    stopped: str = ""
