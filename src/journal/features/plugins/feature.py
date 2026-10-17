from journal.features.feature import Feature
from journal.features.option import Option
from journal.features.plugins.commands.dashboard_command import DashboardCommand
from journal.features.plugins.commands.plugin_command import PluginCommand
from journal.features.plugins.listeners.hold_plugin_folders import HoldPluginFolders
from journal.features.plugins.listeners.plugins_hear_agents import PluginsHearAgents
from journal.features.plugins.listeners.plugins_hear_rows import PluginsHearRows
from journal.features.plugins.listeners.tell_a_plugin_its_settings import TellAPluginItsSettings
from journal.features.plugins.seeds.plugin_services_at_boot import PluginServicesAtBoot


class PluginsFeature(Feature):
    name = "plugins"
    title = "Plugins"
    help = "Programs you install that hear the journal's events and answer them: refuse a tool, say a line to the agent, show a card or run journal commands, each as itself."
    DEADLINE = Option("plugins.deadline", "Wait for plugins at most", "The time every plugin that holds one event shares, below the hook's own ten seconds; a plugin not reached in it is skipped and its fault recorded", 6, unit="seconds")
    options = (DEADLINE,)
    listeners = (HoldPluginFolders, PluginsHearAgents, PluginsHearRows, TellAPluginItsSettings)
    commands = (PluginCommand, DashboardCommand)
    seeds = (PluginServicesAtBoot,)
