import features
import threading
from engine import runtime
from engine.package import data
from engine.record import Record
from engine.upgrades import FETCHING, newer, upstream
from engine.version import version
from features.routing import Reply, Request, handles
from resources.base import Refused
from features.journal_laws.managed import changed_managed, changed_message
from install import release_versions

CHANGELOG = data("CHANGELOG.md")


@handles("GET", "/api/changelog")
def get_changelog(req: Request) -> Reply:
    from features.auto_update.check import journal_repository
    if not CHANGELOG.is_file():
        return Reply(404, {"error": "this install carries no changelog"})
    cache = runtime.upstream_cache(req.root)
    latest = cache.read_text().strip() if cache.is_file() else ""
    return Reply(200, {"version": version(), "changelog": CHANGELOG.read_text(), "latest": latest, "newer": newer(latest, version()),
                       "checking": FETCHING.locked(), "updating": runtime.upgrade_mark(req.root).exists(),
                       "repository": journal_repository(req.root.parent),
                       "changed": [path.relative_to(req.root.parent).as_posix() for path in changed_managed(req.root.parent, req.root)]})


@handles("POST", "/api/update")
def post_update(req: Request) -> Reply:
    from features.auto_update.check import installed, journal_repository
    if journal_repository(req.root.parent):
        raise Refused("this is the journal's own repository: it updates from its own code, not from a release")
    changed = changed_managed(req.root.parent, req.root)
    if changed and not req.body.get("yes"):
        return Reply(409, {"error": changed_message(req.root.parent, changed),
                           "changed": [path.relative_to(req.root.parent).as_posix() for path in changed]})
    chosen = req.body.get("version", "")
    if chosen and chosen not in release_versions():
        raise Refused(f"{chosen} is not a released version")
    threading.Thread(target=installed, args=(req.root, bool(req.body.get("yes")), chosen), daemon=True).start()
    return Reply(200, {"updating": True})


@handles("GET", "/api/releases")
def get_releases(req: Request) -> Reply:
    return Reply(200, {"versions": [found for found in release_versions() if found != version()]})


@handles("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = version()
    latest = upstream(req.root)
    installs = features.FEATURES["auto_update"].on(Record(req.root, runtime.env(req.root))) if "auto_update" in features.FEATURES else False
    changed = changed_managed(req.root.parent, req.root)
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed), "installs": installs,
                       "changed": [path.relative_to(req.root.parent).as_posix() for path in changed]})
