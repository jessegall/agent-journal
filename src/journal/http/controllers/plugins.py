from journal.features.plugins.support.dashboard_document import DashboardDocument
from journal.support.plugin_installing import PluginInstalling
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_record import PluginRecord
from journal.features.plugins.support.plugin_settings import PluginSettings
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.plugin import Plugin
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.support.scope import Scope


class PluginController(Controller[Plugin]):
    """What the Plugins page reads and does, as the user: each plugin with whether it is on, failing or off and its settings' schema, never a secret's value; a preview of a source and its install, a setting changed, a plugin switched, upgraded, removed or purged, and its logs, its record and its dashboard."""

    def __init__(self, plugins: Plugins, installing: PluginInstalling, settings: PluginSettings, folders: PluginFolders, record: PluginRecord, dashboards: DashboardDocument,
                 scope: Scope, environments: Environments) -> None:
        self.repository, self.installing, self.settings, self.folders, self.record, self.dashboards = plugins, installing, settings, folders, record, dashboards
        self.scope, self.environments = scope, environments

    def shown_page(self, rows: list[Plugin]) -> list[dict]:
        return [{**ModelFields.build(p), "status": self.status(p), "schema": self.settings.schema(p)} for p in rows]

    @staticmethod
    def status(plugin: Plugin) -> str:
        if not plugin.enabled:
            return "off"
        return "failing" if plugin.failing_since else "on"

    def preview(self, request: Request) -> Response:
        return Response.json(self.installing.preview(str(request.body.get("source", "")).strip()))

    def install(self, request: Request) -> Response:
        plugin = self.installing.install(str(request.body.get("source", "")).strip(), self.local(), request.actor)
        return Response.json(self.shown(plugin), 201)

    def configure(self, request: Request) -> Response:
        plugin = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.settings.configure(plugin.name, str(request.body.get("key", "")), str(request.body.get("value", "")), request.actor)))

    def enable(self, request: Request) -> Response:
        return Response.json(self.shown(self.installing.enable(self.repository.find(request.number("id")).name, request.actor)))

    def disable(self, request: Request) -> Response:
        return Response.json(self.shown(self.installing.disable(self.repository.find(request.number("id")).name, request.actor)))

    def upgrade_preview(self, request: Request) -> Response:
        return Response.json(self.installing.upgrade_preview(self.repository.find(request.number("id")).name, request.body.get("ref")))

    def upgrade(self, request: Request) -> Response:
        plugin = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.installing.upgrade(plugin.name, request.body.get("ref"), self.local(), request.actor)))

    def remove(self, request: Request) -> Response:
        self.installing.remove(self.repository.find(request.number("id")).name, request.actor)
        return Response.json({})

    def purge(self, request: Request) -> Response:
        self.installing.purge(self.repository.find(request.number("id")).name, request.actor)
        return Response.json({})

    def log(self, request: Request) -> Response:
        plugin, lines = self.repository.find(request.number("id")), int(request.query.get("lines", "200"))
        logs = sorted(self.folders.data(plugin).glob("*.log"))
        return Response.json({"log": "\n".join(line for log in logs for line in log.read_text(errors="replace").splitlines()[-lines:])})

    def recorded(self, request: Request) -> Response:
        return Response.json(self.record.build(self.repository.find(request.number("id")).name))

    def dashboard(self, request: Request) -> Response:
        return Response.json(self.dashboards.build(self.repository.find(request.number("id"))).serialized())

    def local(self) -> str:
        return self.environments.find(self.scope.id).name
