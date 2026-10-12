"""The event catalogue holds every moment of every resource type, and says each by the string the log already holds.

Nothing here is written about one type: it loops over every registered resource type and every moment it
has, so a type added without its moments, or a class whose `on` drifted from `<type>.<moment>`, fails by name.
"""

import importlib
import inspect
from pathlib import Path

import pytest

import events
from events.typed import TypedEvent

CATALOGUE = Path(events.__file__).parent
ROW_MOMENTS = ("created", "updated", "completed")
NOT_A_TYPE = ("__init__", "typed", "answers", "asking", "resources", "measured", "files")


def resource_types() -> dict[str, tuple]:
    from resources.base import Resource
    import resources.types

    for path in sorted((CATALOGUE.parent / "features").glob("*/resource.py")):
        importlib.import_module(f"features.{path.parent.name}.resource")
    found = {}

    def walk(base):
        for kind in base.__subclasses__():
            if kind.__dict__.get("type"):
                found[kind.type] = tuple(kind.moments)
            walk(kind)
    walk(Resource)
    return found


def classes_of(module_name: str) -> list[type]:
    module = importlib.import_module(f"events.{module_name}")
    return [c for _, c in inspect.getmembers(module, inspect.isclass) if issubclass(c, TypedEvent) and c.__module__ == module.__name__]


@pytest.mark.parametrize("kind,moments", sorted(resource_types().items()))
def test_every_moment_of_a_type_is_a_class_in_its_module(kind, moments):
    declared = {c.on for c in classes_of(f"{kind}s")}
    missing = [f"{kind}.{moment}" for moment in dict.fromkeys((*ROW_MOMENTS, *moments)) if f"{kind}.{moment}" not in declared]
    assert missing == [], f"events/{kind}s.py has no class for {', '.join(missing)}"


@pytest.mark.parametrize("module", sorted(p.stem for p in CATALOGUE.glob("*.py") if p.stem not in NOT_A_TYPE))
def test_a_catalogue_module_declares_each_string_once(module):
    """A class is told apart by name(), not by `on`: a hook-filtered subclass of AgentReported shares its parent's `on` and is matched as hook.<name>."""
    names = [c.name() for c in classes_of(module) if c.on]
    assert len(names) == len(set(names)), f"events/{module}.py declares {sorted({n for n in names if names.count(n) > 1})} twice"


def test_the_catalogue_imports_no_feature():
    imported = [p.name for p in CATALOGUE.glob("*.py") if "from features" in p.read_text() or "import features" in p.read_text()]
    assert imported == [], f"{imported} import a feature, so the catalogue could cycle with the features that read it"


def test_a_plugins_declared_events_are_entries_of_the_catalogue_and_a_pattern_naming_none_is_refused(tmp_path):
    """A plugin declares its events in its manifest rather than in code, so each one is seated as an entry of its own and its patterns are held to the catalogue like any other."""
    import json

    from events.catalogue import CATALOGUE
    from features.plugins.manifest import MANIFEST, patterns, read
    from resources.base import Refused

    assert "todo.created" in CATALOGUE.named(), "the journal's own events are in the catalogue, read from its modules"
    CATALOGUE.seat("a-plugin", {"something-happened": {"title": "Something happened"}})
    assert "a-plugin.something-happened" in CATALOGUE.named(), "a plugin's declared event is an entry named <plugin>.<event>"
    assert "a-plugin.something-happened" in patterns(), "so another plugin may listen on it by name"
    assert "todo.escalated" not in patterns(), "a pattern is a string the catalogue holds, not any type and action put together"

    def written(on: dict):
        folder = tmp_path / str(len(list(tmp_path.iterdir())))
        (folder / MANIFEST.parent).mkdir(parents=True)
        (folder / MANIFEST).write_text(json.dumps({"name": "a-plugin", "version": "1.0.0", "title": "A plugin", "description": "for the test",
                                                   "command": "bin/run", "on": on}))
        return read(folder)

    with pytest.raises(Refused) as refusal:
        written({"todo.nothing-like-this": "bin/run"})
    assert "todo.nothing-like-this" in str(refusal.value), f"the refusal names the pattern: {refusal.value}"
    assert written({"todo.created": "bin/run", "a-plugin.something-happened": "bin/run"}).name == "a-plugin", \
        "a pattern the catalogue holds is taken, the plugin's own events among them"
