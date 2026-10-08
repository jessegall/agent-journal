from pathlib import Path

from controllers.notices import Notices
from controllers.types import environment_records
from features.secrets.controller import Secrets
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    """A secret that lists no programs is now given to none, so the user is told which secrets wait for their programs."""
    records = list(environment_records(Path(root)))
    if not records:
        return []
    unlisted = [row for row in Secrets(records[0], actor=SYSTEM).rows.every() if not row.programs and not row.deleted]
    if not unlisted:
        return []
    names = ", ".join(f"{row.title} (secret {row.n})" for row in unlisted)
    Notices(records[0], actor=SYSTEM).create("Some secrets are given to no program until you list their programs", tone="warn",
                                             brief=f"A secret now goes only to the programs it lists, and these list none: {names}. Add the programs each may go to on the Secrets page.")
    return [f"secret {row.n}, {row.title}, lists no programs and is given to none until the user lists them" for row in unlisted]
