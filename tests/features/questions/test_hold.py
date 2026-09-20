import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from commands.http import dispatch  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh("main")
questions = features.FEATURES["questions"]
check("a picked answer is held for three seconds by default", questions.held_for(record), 3)
check("the feature cannot be switched off", (questions.describe()["fixed"], questions.enabled(record)), (True, True))

record.set_setting("questions", {"hold": 8})
check("a setting says how long instead", questions.held_for(record), 8)

got = dispatch("GET", "/api/main/settings", record.root, {}, {})
check("the viewer is handed the hold with the rest of the settings", (got.code, got.body["questions"]["hold"]), (200, 8))
saved = dispatch("POST", "/api/main/settings", record.root, {}, {"questions": {"hold": 1}})
check("and can set it", (saved.code, saved.body["questions"]["hold"]), (200, 1))

done()
