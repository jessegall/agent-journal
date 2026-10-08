from controllers.types import Plugins
from dataclasses import dataclass
from engine.fields import Loaded
from engine.stored import last_lines, read_json
from features.plugins.dashboard import checked
from features.plugins.declared import called, declared
from features.plugins.paths import data
from features.routing import Reply, Request, handles
from resources.base import Missing, Refused, USER


@dataclass(frozen=True)
class PluginSource(Loaded):
    source: str = ""
    ref: str = ""


@handles("GET", "/api/{env}/plugin/{n}/dashboard/{name}")
def get_plugin_dashboard(req: Request) -> Reply:
    row = Plugins(req.record(), actor=USER).load(req.params["n"])
    board = next((b for b in declared(row).dashboards if b.name == req.params["name"]), None)
    if board is None:
        raise Missing(f"{called(row)} declares no dashboard {req.params['name']}")
    found = read_json(data(req.record().root, called(row)) / "dashboards" / f"{board.name}.json", dict, None)
    if found is None:
        return Reply(200, {"title": board.title, "missing": f"{called(row)} has not written its {board.title} dashboard yet"})
    try:
        return Reply(200, {"title": board.title, **checked(found)})
    except Refused as broken:
        return Reply(200, {"title": board.title, "broken": str(broken)})


@handles("GET", "/api/pages")
def get_pages(req: Request) -> Reply:
    from engine.services import status
    from features.plugins.declared import called, declared
    from features.plugins.services import plugin_services, plugins as installed
    where = {spec.id: spec for spec in plugin_services(req.root, set())}
    out = []
    for row in installed(req.root):
        plugin = called(row)
        for page in declared(row).pages:
            sid = f"{plugin}.{page.service}"
            spec, state = where.get(sid), status(req.root, sid)
            path = page.path if page.path else "/"
            out.append({"plugin": plugin, "name": page.name, "title": page.title, "icon": page.icon if page.icon else "plug",
                        "service": sid, "state": state.state if state.state else "not running", "path": path,
                        "url": (spec.url if spec and spec.url else state.url) + path, "status": page.status})
    return Reply(200, out)


@handles("GET", "/api/services")
def get_services(req: Request) -> Reply:
    from engine.services import listed
    from features.plugins.services import plugin_services
    return Reply(200, listed(req.root, (plugin_services,)))


@handles("POST", "/api/{env}/plugins/preview")
def post_plugins_preview(req: Request) -> Reply:
    from features.plugins.commands import VERSION
    from features.plugins.lifecycle import drop
    from features.plugins.preview import previewed
    from features.plugins.staging import staged
    asked = req.body_as(PluginSource)
    source = asked.source
    where, manifest, commit, linked = staged(req.root, source, asked.ref, VERSION)
    try:
        return Reply(200, previewed(manifest, source, commit), timed=False)
    finally:
        drop(where, linked)


@handles("POST", "/api/{env}/plugins/{n}/upgrade-preview")
def post_plugin_upgrade_preview(req: Request) -> Reply:
    from controllers.types import Plugins
    from features.plugins.commands import VERSION
    from features.plugins.declared import Manifest
    from features.plugins.lifecycle import changed, drop
    from features.plugins.preview import previewed
    from features.plugins.staging import followed, staged
    row = Plugins(req.record(), actor=USER).load(req.params["n"])
    where, manifest, commit, linked = staged(req.root, row.source, followed(row.revision), VERSION)
    try:
        return Reply(200, {**previewed(manifest, row.source, commit), "current": commit == row.commit, "changes": changed(Manifest.of(row.manifest), manifest)}, timed=False)
    finally:
        drop(where, linked)


@handles("GET", "/api/plugins/{name}/log")
def get_plugin_log(req: Request) -> Reply:
    from features.plugins.paths import log
    return Reply(200, {"name": req.params["name"], "log": last_lines(log(req.root, req.params["name"]), req.asked_lines())})
