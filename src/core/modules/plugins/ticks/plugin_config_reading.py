from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.plugins.commands.refresh_plugin_config.refresh_plugin_config import RefreshPluginConfig
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginConfigReading:
    """Takes in a plugin config file changed by hand: each switched-on plugin that declares a config has its file read
    again, and a change becomes its next version."""

    def __call__(self, container: Container) -> None:
        plugins = container.get(RunnablePlugins)
        for plugin in plugins.enabled_rows():
            manifest = plugins.readable_manifest(plugin)
            if manifest is None or manifest.config is None:
                continue
            container.get(Bus).run(RefreshPluginConfig(plugin.id), Actor.core())
