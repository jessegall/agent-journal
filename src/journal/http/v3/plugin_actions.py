from journal.features.plugins.installing import Installing
from journal.http.v3.action_body import ActionBody
from journal.features.plugins.plugin_settings import PluginSettings
from journal.models.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.repositories.scope import Scope


class PluginActions:
    """What the Plugins page does to a plugin, as the user: set one of its settings, switch it on or off, upgrade it, and remove or purge it."""

    def __init__(self, plugins: Plugins, installing: Installing, settings: PluginSettings, scope: Scope, environments: Environments) -> None:
        self.plugins, self.installing, self.settings, self.scope, self.environments = plugins, installing, settings, scope, environments

    def configure(self, n: int, body: ActionBody, by: Actor) -> Plugin:
        return self.settings.configure(self.plugins.find(n).name, body.key, body.value, by)

    def enable(self, n: int, body: ActionBody, by: Actor) -> Plugin:
        return self.installing.enable(self.plugins.find(n).name, by)

    def disable(self, n: int, body: ActionBody, by: Actor) -> Plugin:
        return self.installing.disable(self.plugins.find(n).name, by)

    def upgrade(self, n: int, body: ActionBody, by: Actor) -> Plugin:
        return self.installing.upgrade(self.plugins.find(n).name, body.ref, self.environments.find(self.scope.id).name, by)

    def remove(self, n: int, body: ActionBody, by: Actor) -> dict:
        self.installing.remove(self.plugins.find(n).name, by)
        return {"removed": n}

    def purge(self, n: int, body: ActionBody, by: Actor) -> dict:
        self.installing.purge(self.plugins.find(n).name, by)
        return {"purged": n}
