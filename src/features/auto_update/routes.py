import features
import re
import threading
import time
from dataclasses import asdict
from engine import runtime
from engine.memo import Memo
from engine.package import data
from engine.record import Record
from engine.upgrades import FETCHING, newer, upstream
from engine.version import version
from features.auto_update.countdown import cancel
from features.auto_update.new_feature import mark_seen, unseen
from features.routing import Reply, Request, handles
from resources.base import Refused
from features.journal_laws.managed import changed_managed, changed_message
from install import release_versions

CHANGELOG = data("CHANGELOG.md")
ENTRY = re.compile(r"^## ", re.M)
RELEASES_PER_PAGE = 10
CHANGED = Memo()
CHANGED_FOR = 15


def changelog_page(text: str, skip: int) -> tuple[str, int, bool]:
    """The releases from number skip, RELEASES_PER_PAGE of them with the heading above them on the first page, how many have been shown by then and whether more follow."""
    starts = [found.start() for found in ENTRY.finditer(text)]
    stop = min(skip + RELEASES_PER_PAGE, len(starts))
    ends = [*starts[1:], len(text)]
    heading = text[:starts[0] if starts else len(text)] if not skip else ""
    return heading + (text[starts[skip]:ends[stop - 1]] if skip < stop else ""), stop, stop < len(starts)


@handles("GET", "/api/changelog")
def get_changelog(req: Request) -> Reply:
    from features.auto_update.check import journal_repository
    if not CHANGELOG.is_file():
        return Reply(404, {"error": "this install carries no changelog"})
    cache = runtime.upstream_cache(req.root)
    latest = cache.read_text().strip() if cache.is_file() else ""
    changelog, shown, more = changelog_page(CHANGELOG.read_text(), int(req.query.get("skip") or 0))
    return Reply(200, {"version": version(), "changelog": changelog, "shown": shown, "more": more, "latest": latest, "newer": newer(latest, version()),
                       "checking": FETCHING.locked(), "updating": runtime.upgrade_mark(req.root).exists(),
                       "repository": journal_repository(req.root.parent),
                       "changed": [path.relative_to(req.root.parent).as_posix() for path in changed_managed(req.root.parent, req.root)]})


@handles("GET", "/api/new-feature")
def get_new_feature(req: Request) -> Reply:
    return Reply(200, [asdict(one) for one in unseen(req.root, CHANGELOG.read_text() if CHANGELOG.is_file() else "")])


@handles("POST", "/api/new-feature")
def post_new_feature_seen(req: Request) -> Reply:
    mark_seen(req.root, str(req.body.get("id", "")))
    return Reply(200, {"seen": True})


@handles("POST", "/api/update")
def post_update(req: Request) -> Reply:
    from features.auto_update.check import installed, journal_repository
    if journal_repository(req.root.parent):
        raise Refused("this is the journal's own repository: it updates from its own code, not from a release")
    changed = changed_managed(req.root.parent, req.root)
    if changed and not req.body.get("yes"):
        return Reply(409, {"error": changed_message(req.root.parent, changed),
                           "changed": [path.relative_to(req.root.parent).as_posix() for path in changed]})
    if runtime.upgrading(req.root):
        raise Refused("an update is already running")
    chosen = req.body.get("version", "")
    if chosen and chosen not in release_versions():
        raise Refused(f"{chosen} is not a released version")
    threading.Thread(target=installed, args=(req.root, bool(req.body.get("yes")), chosen), daemon=True).start()
    return Reply(200, {"updating": True})


@handles("POST", "/api/update/cancel")
def post_update_cancel(req: Request) -> Reply:
    cancel(req.root)
    return Reply(200, {"cancelled": True})


@handles("GET", "/api/releases")
def get_releases(req: Request) -> Reply:
    return Reply(200, {"versions": [found for found in release_versions() if found != version()]})


@handles("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = version()
    latest = upstream(req.root)
    installs = features.FEATURES["auto_update"].on(Record(req.root, runtime.env(req.root))) if "auto_update" in features.FEATURES else False
    changed = CHANGED.get(str(req.root), int(time.time() // CHANGED_FOR), lambda: changed_managed(req.root.parent, req.root))
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed), "installs": installs,
                       "changed": [path.relative_to(req.root.parent).as_posix() for path in changed]})
