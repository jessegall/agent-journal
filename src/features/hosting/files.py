import tomllib
from dataclasses import dataclass

from resources.fields import Loaded
from resources.base import Refused
from resources.organization import FOLDER

HOSTING = "hosting.toml"


@dataclass(frozen=True)
class Hosting(Loaded):
    run: str = ""
    ready: str = "/"
    idle_minutes: int = 30


def hosting_in(text: str) -> Hosting:
    try:
        return Hosting.from_json(tomllib.loads(text))
    except tomllib.TOMLDecodeError as broken:
        raise Refused(f"{FOLDER}/{HOSTING} cannot be read: {broken}") from broken


def hosting_of(project) -> Hosting | None:
    path = project / FOLDER / HOSTING
    return hosting_in(path.read_text()) if path.is_file() else None
