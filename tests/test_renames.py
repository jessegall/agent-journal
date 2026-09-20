import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from features.renames import rename  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

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
check("the feature's switch and its behaviours' switches move together",
      settings["features"], {"messaging": False, "messaging.holding": True, "rules": True})
check("the cadences the user set move with them",
      sorted(settings["triggers"]), ["messaging", "messaging.holding", "rules"])
check("settings that are not a feature's are untouched", settings["keep"], {"report": 7})
check("a hold written under the old name is released under the new one",
      json.loads((root / "runtime" / "gate-main-s1.json").read_text()),
      {"messaging": "read them first", "work": "declare the work"})
check("the trigger files follow, the feature's and its behaviours'",
      ((root / "runtime" / "trigger-s1-messaging.json").is_file(),
       (root / "runtime" / "trigger-s1-messaging.holding.json").is_file(),
       (root / "runtime" / "trigger-s1-inbox.json").exists()), (True, True, False))
check("another feature's trigger file stays where it is", (root / "runtime" / "trigger-s1-rules.json").is_file(), True)
check("a cursor named after the feature follows", (home / "runtime" / "cursor-messaging").read_text(), "abc")
check("it says what it moved", moved, {"settings": 1, "gates": 1, "triggers": 2, "cursors": 1})

again = rename(root, "inbox", "messaging")
check("running it again does nothing, so it is safe on every load", again, {"settings": 0, "gates": 0, "triggers": 0, "cursors": 0})

# A FEATURE THAT DECLARES WHAT IT WAS MOVES ITS OWN STORAGE WHEN IT LOADS
import features  # noqa: E402
from features.base import Feature  # noqa: E402


class Moved(Feature):
    name = "moved"
    was = ("gone",)


(root / "runtime" / "gate-main-s2.json").write_text(json.dumps({"gone": "held under the old name"}))
features.load(root)
check("loading with a root releases a hold left under a name the feature no longer has",
      json.loads((root / "runtime" / "gate-main-s2.json").read_text()), {"moved": "held under the old name"})

done()
