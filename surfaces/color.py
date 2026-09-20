import json
import re
from pathlib import Path
from engine.stored import write_json


PALETTE = ("#e5484d", "#f76b15", "#ffc53d", "#30a46c", "#12a594", "#0090ff", "#3e63dd", "#8e4ec6", "#d6409f", "#a18072")
COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")


def default(name: str) -> str:
    slot = 0
    for character in name:
        slot = (slot * 31 + ord(character)) % len(PALETTE)
    return PALETTE[slot]


def file(root: Path) -> Path:
    return root / "settings.json"


def settings(root: Path) -> dict:
    try:
        return json.loads(file(root).read_text())
    except (OSError, ValueError):
        return {}


def custom(root: Path) -> str:
    value = settings(root).get("color", "")
    return value.lower() if isinstance(value, str) and COLOR.fullmatch(value) else ""


def set_color(root: Path, value: str | None) -> None:
    if value is not None and (not isinstance(value, str) or not COLOR.fullmatch(value)):
        raise ValueError("color must be a six-digit hex color")
    values = settings(root)
    if value is None:
        values.pop("color", None)
    else:
        values["color"] = value.lower()
    write_json(file(root), values, indent=2)


def identity(root: Path) -> dict:
    project = root.resolve().parent.name
    fallback = default(project)
    chosen = custom(root)
    return {"project": project, "color": chosen or fallback, "default_color": fallback, "custom_color": chosen}
