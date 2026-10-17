from journal.features.feature import Feature
from journal.features.option import Option
from journal.features.plugins.commands.plugin_command import PluginCommand
from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
from journal.features.plugins.listeners.plugins_hear_rows import PluginsHearRows


class PluginsFeature(Feature):
    name = "plugins"
    title = "Plugins"
    help = "Programs you install that hear the journal's events and answer them: refuse a tool, say a line to the agent, show a card or run journal commands, each as itself."
    DEADLINE = Option("plugins.deadline", "Wait for plugins at most", "The time every plugin that holds one event shares, below the hook's own ten seconds; a plugin not reached in it is skipped and its fault recorded", 6, unit="seconds")
    options = (DEADLINE,)
    listeners = (PluginsHearAgents, PluginsHearRows)
    commands = (PluginCommand,)
