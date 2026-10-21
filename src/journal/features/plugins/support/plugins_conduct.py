from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


class PluginsConduct(Conduct):
    """The plugins feature's conduct in every state: the agent never changes an installed plugin's files, so an edit or a shell line that writes into the plugins folder is held. Running a plugin's program is not writing to it; a linked folder is the agent's to work in."""

    def on_tool_starting_plugins(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.plugins.feature import PluginsFeature
        plugins = event.data.of(PluginsFeature)
        if not event.call.writes or not any(plugins.holds(path) for path in event.call.written_paths):
            return self.unchanged()
        return self.hold(PluginsFeature.PLUGIN_FILE_OWNERSHIP.create())
