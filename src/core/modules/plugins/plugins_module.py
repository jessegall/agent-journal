from core.modules.plugins.support.plugin_nudges import PLUGIN_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.plugins.commands.add_plugin_output.add_plugin_output_handler import AddPluginOutputHandler
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults_handler import ClearPluginFaultsHandler
from core.modules.plugins.commands.clear_plugin_queue_file.clear_plugin_queue_file_handler import ClearPluginQueueFileHandler
from core.modules.plugins.commands.configure_plugin.configure_plugin_handler import ConfigurePluginHandler
from core.modules.plugins.commands.configure_plugin.configure_plugin_subcommand import ConfigurePluginSubcommand
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event_handler import DeliverPluginEventHandler
from core.modules.plugins.commands.disable_plugin.disable_plugin_subcommand import DisablePluginSubcommand
from core.modules.plugins.commands.enable_plugin.enable_plugin_subcommand import EnablePluginSubcommand
from core.modules.plugins.commands.install_plugin.install_plugin_handler import InstallPluginHandler
from core.modules.plugins.commands.install_plugin.install_plugin_subcommand import InstallPluginSubcommand
from core.modules.plugins.commands.plugin_record.plugin_record_subcommand import PluginRecordSubcommand
from core.modules.plugins.commands.plugin_list.plugin_list_subcommand import PluginListSubcommand
from core.modules.plugins.commands.plugin_settings.plugin_settings_subcommand import PluginSettingsSubcommand
from core.modules.plugins.commands.plugin_services.plugin_services_subcommand import PluginServicesSubcommand
from core.modules.plugins.commands.plugin_preview.plugin_preview_subcommand import PluginPreviewSubcommand
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin_handler import UpgradePluginHandler
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin_subcommand import UpgradePluginSubcommand
from core.modules.plugins.commands.plugin_latest.plugin_latest_subcommand import PluginLatestSubcommand
from core.modules.plugins.commands.plugin_dashboard.plugin_dashboard_subcommand import PluginDashboardSubcommand
from core.modules.plugins.commands.plugin_dashboards.plugin_dashboards_subcommand import PluginDashboardsSubcommand
from core.modules.plugins.commands.propose_plugin.propose_plugin_subcommand import ProposePluginSubcommand
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault_handler import RecordPluginFaultHandler
from core.modules.plugins.commands.remove_plugin.remove_plugin_handler import RemovePluginHandler
from core.modules.plugins.commands.remove_plugin.remove_plugin_subcommand import RemovePluginSubcommand
from core.modules.plugins.commands.switch_off_changed_plugin.switch_off_changed_plugin_handler import SwitchOffChangedPluginHandler
from core.modules.plugins.commands.switch_plugin.switch_plugin_handler import SwitchPluginHandler
from core.modules.plugins.listeners.plugin_delivery_listener import PluginDeliveryListener
from core.modules.plugins.listeners.plugin_health_mark_listener import PluginHealthMarkListener
from core.modules.plugins.listeners.plugin_output_listener import PluginOutputListener
from core.modules.plugins.listeners.plugin_queue_file_listener import PluginQueueFileListener
from core.modules.plugins.listeners.plugin_skill_publish_listener import PluginSkillPublishListener
from core.modules.plugins.migrations.m001_plugins import PluginsTablesMigration
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.rules.plugin_rule import PluginRule
from core.modules.plugins.support.plugin_marks import PLUGIN_MARKS
from core.modules.plugins.upgrade.plugins_move import PluginsMove

BUILT = ["make", "edit", "show", "list", "delete"]


class PluginsModule(Module):
    """Adds plugins: programs the person installs into the journal, switches on or off and configures, which an
    agent may only propose."""

    name = "journal.core.plugins"
    nudges = PLUGIN_NUDGES
    seed_reason = "a plugin is a program the person installs, which a demo has none of"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.chat", "journal.core.skills",
                    "journal.core.processes"]
    models = [ModelDeclaration(Plugin, query=PluginQuery, excluded_subcommands=BUILT), ModelDeclaration(PluginSetting, excluded_subcommands=BUILT),
              ModelDeclaration(PluginDelivery, excluded_subcommands=BUILT), ModelDeclaration(PluginOutput, excluded_subcommands=BUILT),
              ModelDeclaration(PluginQueueFile, excluded_subcommands=BUILT)]
    moves = [PluginsMove]
    windows = [WindowDeclaration("plugins.plugins", "Plugins", "plugins.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.PLUGIN, reads=["plugin record", "plugin list", "plugin settings", "plugin services", "plugin preview", "plugin latest", "plugin dashboard", "plugin dashboards"],
                                 runs=["plugin upgrade", "plugin enable", "plugin disable", "plugin install", "plugin remove", "plugin configure", "message send"], events=["plugin.*"])]
    migrations = [PluginsTablesMigration]
    handlers = [UpgradePluginHandler, InstallPluginHandler, SwitchPluginHandler, ConfigurePluginHandler, RemovePluginHandler, DeliverPluginEventHandler, SwitchOffChangedPluginHandler,
                RecordPluginFaultHandler, ClearPluginFaultsHandler, AddPluginOutputHandler,
                ClearPluginQueueFileHandler]
    settings = [SettingValue("hold_window_ms", "Plugin answer limit", "The most milliseconds a plugin may take to answer an event it holds before the agent goes on.",
                             SettingType.NUMBER, default=50, scope=SettingScope.PROJECT),
                SettingValue("condition_limit_seconds", "Service condition limit", "The most seconds a plugin service's condition may take before it counts as failed.",
                             SettingType.NUMBER, default=10, scope=SettingScope.PROJECT)]
    driver_rules = [PluginRule]
    marks = PLUGIN_MARKS
    listeners = [PluginSkillPublishListener, PluginDeliveryListener, PluginHealthMarkListener, PluginOutputListener, PluginQueueFileListener]
    subcommands = (PluginRecordSubcommand, PluginListSubcommand, PluginSettingsSubcommand, PluginServicesSubcommand, UpgradePluginSubcommand, PluginPreviewSubcommand, PluginLatestSubcommand, PluginDashboardSubcommand, PluginDashboardsSubcommand, ProposePluginSubcommand, InstallPluginSubcommand, EnablePluginSubcommand,
                   DisablePluginSubcommand, ConfigurePluginSubcommand, RemovePluginSubcommand)
