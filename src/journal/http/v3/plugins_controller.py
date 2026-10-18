from journal.features.plugins.dashboard_document import DashboardDocument
from journal.features.plugins.installing import Installing
from journal.features.plugins.plugin_folders import PluginFolders
from journal.features.plugins.plugin_record import PluginRecord
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.plugins import Plugins
from journal.repositories.scope import Scope
from journal.repositories.environments import Environments


class PluginsController:
    """The Plugins page's paths that are no act on a row: the preview of a source, an install from it, an upgrade's preview, a plugin's service logs and its record."""

    def __init__(self, installing: Installing, plugins: Plugins, folders: PluginFolders, scope: Scope, environments: Environments, record: PluginRecord, dashboards: DashboardDocument) -> None:
        self.installing, self.plugins, self.folders, self.scope, self.environments, self.record = installing, plugins, folders, scope, environments, record
        self.dashboards = dashboards

    def preview(self, request: Request) -> Response:
        return Response.json(self.installing.preview(request.body.get("source", "").strip()))

    def install(self, request: Request) -> Response:
        plugin = self.installing.install(request.body.get("source", "").strip(), self.environments.find(self.scope.id).name, request.actor)
        return Response.json({"n": plugin.id, "name": plugin.name})

    def upgrade_preview(self, request: Request) -> Response:
        return Response.json(self.installing.upgrade_preview(self.plugins.find(request.number("n")).name, request.body.get("ref")))

    def log(self, request: Request) -> Response:
        """The last lines its services wrote, every log in its data folder."""
        found = self.plugins.where(name=request.params["name"])
        lines = int(request.query.get("lines", "200"))
        logs = sorted(self.folders.data(found[0]).glob("*.log")) if found else []
        return Response.json({"log": "\n".join(line for log in logs for line in log.read_text(errors="replace").splitlines()[-lines:])})

    def record_of(self, request: Request) -> Response:
        return Response.json({"record": self.record.of(request.params["name"])})

    def dashboard(self, request: Request) -> Response:
        return Response.json(self.dashboards.of(self.plugins.find(request.number("n"))).to_json())
