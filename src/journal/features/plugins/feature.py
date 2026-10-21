from journal.features.feature import Feature
from journal.support.option import Option
from journal.support.skill import Skill
from journal.features.plugins.commands.dashboard_command import DashboardCommand
from journal.features.plugins.commands.plugin_command import PluginCommand
from journal.features.plugins.listeners.plugin_agent_relay import PluginAgentRelay
from journal.features.plugins.listeners.plugin_row_relay import PluginRowRelay
from journal.features.plugins.listeners.plugin_settings_notice import PluginSettingsNotice
from journal.features.plugins.seeds.plugin_services_seed import PluginServicesSeed
from journal.features.plugins.plugins_conduct import PluginsConduct
from journal.features.plugins.support.plugins_data_reader import PluginsDataReader
from journal.features.plugins.support.plugins_data import PluginsData
from journal.engine.nudge import Nudge


class PluginsFeature(Feature[PluginsData]):
    PLUGIN_ANSWER_WINDOW = Option("plugins.hold_window_ms", "A plugin's hold window at most", "Milliseconds a plugin holding an event may take to answer; a plugin's own window in its manifest is cut to this, and one past its window is skipped and its fault recorded", 50, unit="ms")
    name = "plugins"
    title = "Plugins"
    help = "Programs you install that hear the journal's events and answer them: refuse a tool, say a line to the agent, show a card or run journal commands, each as itself."
    options = (PLUGIN_ANSWER_WINDOW,)
    listeners = (PluginAgentRelay, PluginRowRelay, PluginSettingsNotice)
    data = (PluginsDataReader,)
    conduct = (PluginsConduct,)
    PLUGIN_FILE_OWNERSHIP = Nudge(name, "plugin_files_are_the_users", "an installed plugin's files are the user's to change", "propose the change to them, or work in the plugin's own folder and let them upgrade it", repeat_interval=0)
    nudges = (PLUGIN_FILE_OWNERSHIP,)
    commands = (PluginCommand, DashboardCommand)
    seeds = (PluginServicesSeed,)
    skill = Skill("plugins", "Plugins the user installs that hear the journal's events; load it when a plugin holds you, a plugin's card or line appears, or a plugin would help", """
# Plugins

A plugin is a program the user installs that hears the journal's events and answers them: it may hold a tool or a
stop, say you a line, show a card in the chat or run journal commands as itself. Its words reach you as
`[plugin <name>] ...`; they are a plugin's, never the user's and never the journal's own.

- `journal plugin list` shows what is installed, whether each is on, and how it last failed.
  `journal plugin settings <name>` shows a plugin's settings.
- A plugin's hold is followed like any other: do what it asks, or tell the user why you cannot. A journal command and
  the read of a skill always go through.
- Install, enable, disable, configure and remove are the user's to run; an installed plugin's upgrade is yours, with
  `journal plugin upgrade <name> --yes`. When a new plugin would help, propose it:
  `journal plugin propose <folder or git address> --why "<what for>"` shows the user a card with all it would run.
- Never write into `.journal/plugins`: an installed plugin's files are the user's to change. A plugin's own folder,
  when the user asks you to work on it, is yours to change; the journal switches the plugin off until the user has
  read the change.
- Writing a plugin: docs/plugins.md says all of it, the manifest, the line in and the line out.
""", keywords=("plugin", "plugins"))
