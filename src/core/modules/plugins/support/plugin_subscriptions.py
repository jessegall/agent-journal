from core.base.model.event_form import EventForm
from core.base.registry.registry import Registry
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.runnable_plugin import RunnablePlugin
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginSubscriptions:
    """The scripts of the plugins that may run, for each event and form, in install order, through the keys of the
    registry. A wrong key, a form the event does not offer and a wrong script are not in the map. The map is built
    once for each state of the plugins."""

    def __init__(self, runnable: RunnablePlugins, registry: Registry, plugins: PluginQuery) -> None:
        self.runnable, self.registry, self.plugins = runnable, registry, plugins
        self.state: tuple[tuple[int, int, str], ...] = ()
        self.subscriptions: dict[tuple[str, EventForm], tuple[PluginSubscription, ...]] = {}

    def scripts(self, log_name: str, form: EventForm) -> tuple[PluginSubscription, ...]:
        state = tuple((plugin.id, plugin.version, plugin.files_digest) for plugin in self.plugins.enabled_plugins())
        if state != self.state:
            self.state = state
            self.subscriptions = self.built_map(self.runnable.running())
        return self.subscriptions.get((log_name, form), ())

    def built_map(self, running: list[RunnablePlugin]) -> dict[tuple[str, EventForm], tuple[PluginSubscription, ...]]:
        found: dict[tuple[str, EventForm], list[PluginSubscription]] = {}
        for runnable in running:
            for key in dict.fromkeys(listener.event for listener in runnable.manifest.listeners if not listener.is_wrong):
                event = self.registry.event_name(key)
                offered = self.registry.event_keys[event].forms if event else ()
                for form in offered:
                    script = runnable.manifest.script_for_key(key, form)
                    if script:
                        found.setdefault((event, form), []).append(PluginSubscription(runnable.plugin.name, script, runnable.plugin.id))
        return {place: tuple(rows) for place, rows in found.items()}
