from pathlib import Path

from controllers.types import Features, environment_records
from engine.stored import read_json, write_json
from resources.base import SYSTEM

FORM, MASCOT, AVATAR = "form_of_address", "mascot", "avatar"


def run(root: Path) -> str:
    """Carries the voice figure's switch from the form of address to the avatar feature, so an environment that had the figure on keeps it on."""
    file = Path(root) / "settings.json"
    held = read_json(file, dict, {})
    form = held.get(FORM, {})
    if MASCOT not in form:
        return "the voice figure had no switch to carry"
    chosen = bool(form.pop(MASCOT))
    write_json(file, held, indent=2)
    for record in environment_records(Path(root)):
        Features(record, actor=SYSTEM).switch(AVATAR, chosen)
    return f"the voice figure's switch moved to the avatar feature, {'on' if chosen else 'off'}"
