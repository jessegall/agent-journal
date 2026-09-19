import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Notifications  # noqa: E402
from features import FEATURES  # noqa: E402
from features.updates.feature import newer  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()
updates = FEATURES["updates"]

record = fresh("main")
check("a first install only notes its version", (updates.announce(record.root, "2.10.0"), Notifications(record).all()), ("", []))
check("the same version again says nothing", updates.announce(record.root, "2.10.0"), "")
check("a new version is announced", updates.announce(record.root, "2.11.0"), "2.11.0")
told = Notifications(record).all()[-1]
check("as a notification marked as an update, naming both versions", (told.title, told.data.get("kind"), told.brief), ("Journal updated to 2.11.0", "update", "The journal went from 2.10.0 to 2.11.0."))
check("and only once", (updates.announce(record.root, "2.11.0"), len(Notifications(record).all())), ("", 1))

# VERSIONS ARE COMPARED IN ONE PLACE, part by part
check("a version is newer only when a part of it is bigger", [newer(a, b) for a, b in (("2.13.0", "2.9.4"), ("2.9.4", "2.13.0"), ("2.13.0", "2.13.0"), ("2.13.1", "2.13.0"), ("", "2.13.0"), ("x.y", "2.13.0"))],
      [True, False, False, True, False, False])

done()
