from pathlib import Path

from engine.paths import environments
from engine.stored import read_json, write_json

PER_PROVIDER = {"boards": ("filler_model", "reviewer_model")}
CHOSEN_FOR = "claude"


def run(root: Path) -> list[str]:
    root = Path(root)
    files = [root / "settings.json", *(home / "settings.json" for home in environments(root).glob("*"))]
    return [line for file in files if file.is_file() for line in per_provider(file)]


def per_provider(file: Path) -> list[str]:
    held = read_json(file, dict, {})
    moved = []
    for feature, names in PER_PROVIDER.items():
        values = held.get(feature)
        if not isinstance(values, dict):
            continue
        for name in names:
            if not isinstance(values.get(name), str):
                continue
            values[name] = {CHOSEN_FOR: values[name]}
            moved.append(f"{feature} {name} in {file.parent.name} is now Claude's model, beside each other provider's own")
    if moved:
        write_json(file, held, indent=2)
    return moved
