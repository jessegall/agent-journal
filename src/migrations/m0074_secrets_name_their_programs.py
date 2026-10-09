from pathlib import Path

from controllers.notices import Notices
from controllers.types import environment_records
from features.secrets.controller import Secrets
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    """A secret with no allowed programs is given to none, so the user is told which secrets wait for them."""
    records = list(environment_records(Path(root)))
    if not records:
        return []
    unlisted = [row for row in Secrets(records[0], actor=SYSTEM).rows.every() if not row.programs and not row.deleted]
    if not unlisted:
        return []
    names = ", ".join(f"{row.title} (secret {row.n})" for row in unlisted)
    Notices(records[0], actor=SYSTEM).create("Some secrets have no allowed programs", tone="warn",
                                             brief=f"A secret now goes only to its Allowed programs, and these have none: {names}. Add them under Settings > Secrets.")
    return [f"secret {row.n}, {row.title}, has No allowed programs until the user adds some" for row in unlisted]
