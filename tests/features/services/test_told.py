import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Notices  # noqa: E402
from engine.services import status_file  # noqa: E402
from engine.stored import write_json  # noqa: E402
from features import FEATURES  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh("main")
root = record.root
services = FEATURES["services"]

# A SERVICE THAT GIVES UP is said once, with its log
write_json(status_file(root, "works.web"), {"state": "failed", "why": "it stopped 5 times within 60 seconds"})
check("the first look says it", services.told(root), ["works.web"])
told = Notices(record).all()[0]
check("the notice names the service, why, and where its log is", (told.title, "5 times" in told.brief, "service-works.web.log" in told.brief, told.data["tone"]),
      ("Service works.web is not running", True, True, "warn"))
check("it is not said twice", (services.told(root), len(Notices(record).all())), ([], 1))

# A PORT THAT IS TAKEN is said the same way
write_json(status_file(root, "works.queue"), {"state": "blocked", "why": "port 8000 is in use"})
check("a blocked service is said too", services.told(root), ["works.queue"])

# ONCE IT RUNS AGAIN the notice closes itself
write_json(status_file(root, "works.web"), {"state": "ready"})
services.told(root)
check("the notice for a service that came back is closed", (bool(Notices(record).load(told.n).completed), Notices(record).load(told.n).outcome),
      (True, "it is running again"))
check("and the one still blocked stays open", len([n for n in Notices(record).all() if not n.completed]), 1)

# IT CANNOT BE SWITCHED OFF: a service nobody watches is worse than one that says so
record.set_setting("features", {"services": False})
write_json(status_file(root, "works.third"), {"state": "failed", "why": "no"})
check("services are watched even with the feature switched off in settings", services.told(root), ["works.third"])

done()
