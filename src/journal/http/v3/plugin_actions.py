from journal.features.plugins.installing import Installing
from journal.features.plugins.plugin_settings import PluginSettings
from journal.models.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.plugins import Plugins


class PluginActions:
    """What the Plugins page does to a plugin, as the user: set one of its settings, switch it on or off, upgrade it, and remove or purge it."""

    def __init__(self, plugins: Plugins, installing: Installing, settings: PluginSettings) -> None:
        self.plugins, self.installing, self.settings = plugins, installing, settings

    def configure(self, n: int, body: dict, by: Actor) -> Plugin:
        return self.settings.configure(self.plugins.find(n).name, body["key"], str(body["value"]), by)

    def enable(self, n: int, body: dict, by: Actor) -> Plugin:
        return self.installing.enable(self.plugins.find(n).name, by)

    def disable(self, n: int, body: dict, by: Actor) -> Plugin:
        return self.installing.disable(self.plugins.find(n).name, by)

    def upgrade(self, n: int, body: dict, by: Actor) -> Plugin:
        return self.installing.upgrade(self.plugins.find(n).name, body.get("ref", ""), by)

    def remove(self, n: int, body: dict, by: Actor) -> dict:
        self.installing.remove(self.plugins.find(n).name, by)
        return {"removed": n}

    def purge(self, n: int, body: dict, by: Actor) -> dict:
        self.installing.purge(self.plugins.find(n).name, by)
        return {"purged": n}
