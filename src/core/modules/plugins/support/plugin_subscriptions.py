from collections.abc import Iterator

from core.base.model.event_form import EventForm
from core.base.registry.registry import Registry
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.runnable_plugin import RunnablePlugin
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginSubscriptions:
    """Indexes runnable plugin scripts by event and form."""

    def __init__(self, runnable: RunnablePlugins, registry: Registry) -> None:
        self.runnable, self.registry = runnable, registry
        self.state: tuple[tuple[int, int, str], ...] = ()
        self.subscriptions: dict[tuple[str, EventForm], tuple[PluginSubscription, ...]] = {}

    def scripts(self, log_name: str, form: EventForm) -> tuple[PluginSubscription, ...]:
        state = tuple((plugin.id, plugin.version, plugin.files_digest) for plugin in self.runnable.enabled_rows())
        if state != self.state:
            self.state = state
            self.subscriptions = self.build_map(self.runnable.running())
        return self.subscriptions.get((log_name, form), ())

    def build_map(self, running: list[RunnablePlugin]) -> dict[tuple[str, EventForm], tuple[PluginSubscription, ...]]:
        subscriptions: dict[tuple[str, EventForm], list[PluginSubscription]] = {}
        for event_form, subscription in (row for runnable in running for row in self.plugin_rows(runnable)):
            subscriptions.setdefault(event_form, []).append(subscription)
        return {event_form: tuple(rows) for event_form, rows in subscriptions.items()}

    def plugin_rows(self, runnable: RunnablePlugin) -> Iterator[tuple[tuple[str, EventForm], PluginSubscription]]:
        manifest = runnable.manifest
        for key in dict.fromkeys(listener.event for listener in manifest.listeners if not listener.is_wrong):
            event = self.registry.event_name(key)
            forms = self.registry.event_keys[event].forms if event else ()
            yield from (((event, form), PluginSubscription(runnable.plugin.name, manifest.script(key, form), runnable.plugin.id, manifest.allows_skip(key), manifest.listen_window_ms(key))) for form in forms if manifest.script(key, form))
