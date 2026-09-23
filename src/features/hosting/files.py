from dataclasses import dataclass

from engine.fields import Loaded
from features.organization.files import FOLDER, parsed

HOSTING = "hosting.toml"


@dataclass(frozen=True)
class Hosting(Loaded):
    run: str = ""
    ready: str = "/"
    idle_minutes: int = 30


def hosting_of(project) -> Hosting | None:
    path = project / FOLDER / HOSTING
    return Hosting.from_json(parsed(path)) if path.is_file() else None
