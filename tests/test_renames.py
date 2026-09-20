import json

from features.renames import rename
from tests.conftest import fresh


def test_renames():
    record = fresh("main")
    root = record.root
    home = root / "environments" / "main"
    (home / "runtime").mkdir(parents=True, exist_ok=True)
    (root / "runtime").mkdir(parents=True, exist_ok=True)

    (home / "settings.json").write_text(json.dumps({
        "features": {"inbox": False, "inbox.holding": True, "rules": True},
        "triggers": {"inbox": {"every": 3, "unit": "uses"}, "inbox.holding": {"every": 9, "unit": "uses"}, "rules": {"on": "idle"}},
        "keep": {"report": 7},
    }))
    (root / "runtime" / "gate-main-s1.json").write_text(json.dumps({"inbox": "read them first", "work": "declare the work"}))
    (root / "runtime" / "trigger-s1-inbox.json").write_text(json.dumps({"uses": 4}))
    (root / "runtime" / "trigger-s1-inbox.holding.json").write_text(json.dumps({"uses": 9}))
    (root / "runtime" / "trigger-s1-rules.json").write_text(json.dumps({"uses": 1}))
    (home / "runtime" / "cursor-inbox").write_text("abc")

    moved = rename(root, "inbox", "messaging")
    settings = json.loads((home / "settings.json").read_text())

    assert settings["features"] == {"messaging": False, "messaging.holding": True, "rules": True}, \
        "the feature's switch and its behaviours' switches move together"
    assert sorted(settings["triggers"]) == ["messaging", "messaging.holding", "rules"], \
        "the cadences the user set move with them"
    assert settings["keep"] == {"report": 7}, "settings that are not a feature's are untouched"
    assert json.loads((root / "runtime" / "gate-main-s1.json").read_text()) == \
        {"messaging": "read them first", "work": "declare the work"}, \
        "a hold written under the old name is released under the new one"
    assert (
        (root / "runtime" / "trigger-s1-messaging.json").is_file(),
        (root / "runtime" / "trigger-s1-messaging.holding.json").is_file(),
        (root / "runtime" / "trigger-s1-inbox.json").exists(),
    ) == (True, True, False), "the trigger files follow, the feature's and its behaviours'"
    assert (root / "runtime" / "trigger-s1-rules.json").is_file() is True, \
        "another feature's trigger file stays where it is"
    assert (home / "runtime" / "cursor-messaging").read_text() == "abc", \
        "a cursor named after the feature follows"
    assert moved == {"settings": 1, "gates": 1, "triggers": 2, "cursors": 1}, "it says what it moved"

    again = rename(root, "inbox", "messaging")
    assert again == {"settings": 0, "gates": 0, "triggers": 0, "cursors": 0}, \
        "running it again does nothing, so it is safe on every load"

    import features
    from features.base import Feature

    class Moved(Feature):
        name = "moved"
        was = ("gone",)

    (root / "runtime" / "gate-main-s2.json").write_text(json.dumps({"gone": "held under the old name"}))
    features.load(root)
    assert json.loads((root / "runtime" / "gate-main-s2.json").read_text()) == {"moved": "held under the old name"}, \
        "loading with a root releases a hold left under a name the feature no longer has"
