import features
import threading
from engine import runtime
from engine.package import code
from engine.record import Record
from engine.upgrades import FETCHING, newer, upstream
from engine.version import version
from features.routing import Reply, Request, handles
from resources.base import Refused


@handles("GET", "/api/changelog")
def get_changelog(req: Request) -> Reply:
    from features.auto_update.check import journal_repository
    log = code(req.root) / "CHANGELOG.md"
    if not log.is_file():
        return Reply(404, {"error": "this install carries no changelog"})
    cache = runtime.upstream_cache(req.root)
    latest = cache.read_text().strip() if cache.is_file() else ""
    return Reply(200, {"version": version(), "changelog": log.read_text(), "latest": latest, "newer": newer(latest, version()),
                       "checking": FETCHING.locked(), "updating": runtime.upgrade_mark(req.root).exists(),
                       "repository": journal_repository(req.root.parent)})


@handles("POST", "/api/update")
def post_update(req: Request) -> Reply:
    from features.auto_update.check import installed, journal_repository
    if journal_repository(req.root.parent):
        raise Refused("this is the journal's own repository: it updates from its own code, not from a release")
    threading.Thread(target=installed, args=(req.root,), daemon=True).start()
    return Reply(200, {"updating": True})


@handles("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = version()
    latest = upstream(req.root)
    installs = features.FEATURES["auto_update"].on(Record(req.root, runtime.env(req.root))) if "auto_update" in features.FEATURES else False
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed), "installs": installs})
