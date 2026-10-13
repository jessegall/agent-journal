from pathlib import Path

from controllers.types import Features, environment_records
from resources.base import SYSTEM

AVATAR = "avatar"


def run(root: Path) -> str:
    """Switches the avatar on in every project once, with the release that made it on by default."""
    records = list(environment_records(Path(root)))
    if not records:
        return "no environment to switch the avatar on in"
    Features(records[0], actor=SYSTEM).switch(AVATAR, True)
    return "the avatar is switched on"
