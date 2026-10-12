from pathlib import Path

from controllers.types import Features, environment_records
from resources.base import SYSTEM

AVATAR = "avatar"


def run(root: Path) -> str:
    """Lifts the figure's switch from each environment to the project, as the form of address kept it, so a figure that was on stays on."""
    records = list(environment_records(Path(root)))
    rows = [Features(record, actor=SYSTEM).rows.by_title(AVATAR) for record in records]
    chosen = [row.enabled for row in rows if row]
    if not chosen or not records:
        return "no environment had chosen whether to show the figure"
    Features(records[0], actor=SYSTEM).switch(AVATAR, any(chosen))
    return f"the figure's switch is kept for the project, {'on' if any(chosen) else 'off'}"
