import importlib.util
from collections.abc import Sequence
from pathlib import Path

from engine.database.database import Database
from engine.registry.registry import Registry

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_check.py"


def move_check():
    specification = importlib.util.spec_from_file_location("move_check", SCRIPT)
    assert specification is not None and specification.loader is not None
    script = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(script)
    return script


def saved_registry(story) -> str:
    return Registry.read(story.container.get(Database)).entries_text()


def expect_registry_equal(story, saved: str, allowed: Sequence[str] = ()) -> None:
    """The story's registry now equals the saved one, sort by sort; each difference names the sort, the entry and the field."""
    differences = move_check().registry_differences(saved, saved_registry(story), {}, allowed)
    story.expect_rows(differences == [], detail="\n".join(differences))
