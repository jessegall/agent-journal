from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line_handler import SendPluginStepLineHandler
from core.modules.plugins.commands.log_plugin_line.log_plugin_line_handler import LogPluginLineHandler
from core.modules.plugins.commands.log_plugin_line.log_plugin_line_subcommand import LogPluginLineSubcommand
from core.modules.plugins.migrations.m004_plugin_session import PluginSessionMigration
from core.modules.plugins.migrations.m003_plugin_output_index import PluginOutputIndexMigration
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit_handler import DeliverFileEditHandler
from engine.file.project_reads import ProjectReads
from core.modules.plugins.guards.plugin_event_guard import PluginEventGuard
from core.modules.plugins.migrations.m006_plugin_output_environment import PluginOutputEnvironmentMigration
from core.modules.plugins.migrations.m007_plugin_config import PluginConfigMigration
from core.modules.plugins.migrations.m008_plugin_setting_environments import PluginSettingEnvironmentsMigration
from core.modules.plugins.commands.prune_plugin_deliveries.prune_plugin_deliveries_handler import PrunePluginDeliveriesHandler
from core.modules.plugins.ticks.delivery_pruning import DeliveryPruning
from core.modules.plugins.ticks.orphan_service_stopping import OrphanServiceStopping
from core.modules.plugins.ticks.plugin_config_reading import PluginConfigReading
from core.modules.plugins.commands.refresh_plugin_config.refresh_plugin_config_handler import RefreshPluginConfigHandler
from core.modules.plugins.commands.refresh_plugin_config.refresh_plugin_config_subcommand import RefreshPluginConfigSubcommand
from core.modules.plugins.listeners.plugin_event_listener import PluginEventListener
from core.modules.plugins.listeners.plugin_wrong_key_mark_listener import PluginWrongKeyMarkListener
from core.modules.plugins.listeners.system_event_delivery_listener import SystemEventDeliveryListener
from core.modules.plugins.migrations.m005_plugin_event_deliveries import PluginEventDeliveriesMigration
from core.modules.plugins.commands.plugin_events.plugin_events_subcommand import PluginEventsSubcommand
from core.modules.plugins.support.plugin_event_names import PLAIN_EVENTS
from core.modules.plugins.commands.run_plugin_command.run_plugin_command_handler import RunPluginCommandHandler
from core.modules.plugins.commands.run_plugin_command.run_plugin_command_subcommand import RunPluginCommandSubcommand
from core.modules.plugins.commands.post_plugin_card.post_plugin_card_subcommand import PostPluginCardSubcommand
from core.modules.plugins.commands.plugin_changes.plugin_changes_subcommand import PluginChangesSubcommand
from core.modules.plugins.commands.plugin_checkout.plugin_checkout_subcommand import PluginCheckoutSubcommand
from core.modules.plugins.commands.plugin_path.plugin_path_subcommand import PluginPathSubcommand
from core.modules.plugins.commands.plugin_file.plugin_file_subcommand import PluginFileSubcommand
from core.modules.plugins.support.plugin_nudges import PLUGIN_NUDGES
from core.modules.plugins.support.plugin_project_reads import PluginProjectReads
from core.base.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.plugins.support.plugin_searcher import PluginSearcher
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
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
from core.modules.plugins.commands.plugin_try.plugin_try_subcommand import PluginTrySubcommand
from core.modules.plugins.commands.plugin_list.plugin_list_subcommand import PluginListSubcommand
from core.modules.plugins.commands.plugin_settings.plugin_settings_subcommand import PluginSettingsSubcommand
from core.modules.plugins.commands.plugin_services.plugin_services_subcommand import PluginServicesSubcommand
from core.modules.plugins.listeners.plugin_services_upgrade_listener import PluginServicesUpgradeListener
from core.modules.plugins.listeners.plugin_services_removal_listener import PluginServicesRemovalListener
from core.modules.plugins.commands.plugin_service_log.plugin_service_log_subcommand import PluginServiceLogSubcommand
from core.modules.plugins.commands.change_plugin_service.change_plugin_service_handler import ChangePluginServiceHandler
from core.modules.plugins.commands.change_plugin_service.change_plugin_service_subcommand import ChangePluginServiceSubcommand
from core.modules.plugins.commands.plugin_preview.plugin_preview_subcommand import PluginPreviewSubcommand
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin_handler import UpgradePluginHandler
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin_subcommand import UpgradePluginSubcommand
from core.modules.plugins.commands.plugin_latest.plugin_latest_subcommand import PluginLatestSubcommand
from core.modules.plugins.commands.plugin_dashboard.plugin_dashboard_subcommand import PluginDashboardSubcommand
from core.modules.plugins.commands.plugin_dashboards.plugin_dashboards_subcommand import PluginDashboardsSubcommand
from core.modules.plugins.commands.plugin_descriptions.plugin_descriptions_subcommand import PluginDescriptionsSubcommand
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
from core.modules.plugins.listeners.login_path_listener import LoginPathListener
from core.modules.plugins.listeners.journal_instruction_file_listener import JournalInstructionFileListener
from core.modules.plugins.listeners.plugin_skill_publish_listener import PluginSkillPublishListener
from core.modules.plugins.listeners.stale_managed_hooks_listener import StaleManagedHooksListener
from core.modules.plugins.migrations.m001_plugins import PluginsTablesMigration
from core.modules.plugins.migrations.m002_plugin_queue_index import PluginQueueIndexMigration
from core.modules.plugins.migrations.m009_plain_column_names import PlainColumnNamesMigration
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from core.modules.plugins.models.plugin_setting import PluginSetting
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from core.modules.plugins.rules.plugin_rule import PluginRule
from core.modules.plugins.rules.plugin_program_rule import PluginProgramRule
from core.modules.plugins.support.plugin_marks import PLUGIN_MARKS
from core.modules.plugins.upgrade.plugins_move import PluginsMove
from core.modules.plugins.support.skeletons import PLUGINS_PLUGINS_SKELETON


class PluginsModule(Module):
    """Adds plugins: programs the person installs into the journal, switches on or off and configures, which
    an agent may only propose."""

    name = "journal.core.plugins"
    nudges = PLUGIN_NUDGES
    seed_reason = "a plugin is a program the person installs, which a demo has none of"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.chat", "journal.core.skills",
                    "journal.core.processes", "journal.core.agents", "journal.core.messages"]
    skills = [SkillDeclaration("journal-plugins", "See what plugins do, install and upgrade them or propose one to the user; read it before the first plugin command of a session", keywords=("plugin", "plugins"), commands=["plugin"])]
    models = [ModelDeclaration(Plugin, query=PluginQuery, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(PluginSetting, excluded_subcommands=ALL_SUBCOMMANDS),
              ModelDeclaration(PluginDelivery, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(PluginOutput, excluded_subcommands=ALL_SUBCOMMANDS),
              ModelDeclaration(PluginQueueFile, excluded_subcommands=ALL_SUBCOMMANDS)]
    moves = [PluginsMove]
    windows = [WindowDeclaration("plugins.plugins", "Plugins", "plugins.js", WindowLoading.COMPONENT, skeleton=PLUGINS_PLUGINS_SKELETON, search=WindowSearch(PluginSearcher, "Search the plugins"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.PLUGIN, reads=["plugin events", "plugin service-log", "plugin record", "plugin list", "plugin settings", "plugin services", "plugin preview", "plugin latest", "plugin dashboard", "plugin dashboards", "plugin descriptions"],
                                 keys=[WindowKey("plugins", "plugin list", events=["plugin.*"]),
                                       WindowKey("dashboards", "plugin dashboards", events=["plugin.*"]),
                                       WindowKey("descriptions", "plugin descriptions", events=["plugin.*"]),
                                       WindowKey("services", "plugin services", events=["plugin.*"], reload_seconds=15),
                                       WindowKey("preview", "plugin preview {source}", loading=KeyLoading.REQUESTED),
                                       WindowKey("latest.*", "plugin latest {id}", name_ids=True, loading=KeyLoading.REQUESTED),
                                       WindowKey("settings.*", "plugin settings {id}", name_ids=True, loading=KeyLoading.REQUESTED),
                                       WindowKey("record.*", "plugin record {id}", name_ids=True, loading=KeyLoading.REQUESTED),
                                       WindowKey("dashboard", "plugin dashboard {plugin}", tab="dashboard"),
                                       WindowKey("dashboard-poll", "plugin dashboard {plugin}", tab="dashboard-poll", reload_seconds=60)],
                                 runs=["plugin service", "plugin upgrade", "plugin enable", "plugin disable", "plugin install", "plugin remove", "plugin configure", "message send"], events=["plugin.*"])]
    migrations = [PlainColumnNamesMigration, PluginConfigMigration, PluginOutputEnvironmentMigration, PluginEventDeliveriesMigration, PluginSessionMigration, PluginOutputIndexMigration, PluginsTablesMigration, PluginQueueIndexMigration, PluginSettingEnvironmentsMigration]
    handlers = [ChangePluginServiceHandler, LogPluginLineHandler, RefreshPluginConfigHandler, PrunePluginDeliveriesHandler, RunPluginCommandHandler, SendPluginStepLineHandler, DeliverFileEditHandler, UpgradePluginHandler, InstallPluginHandler, SwitchPluginHandler, ConfigurePluginHandler, RemovePluginHandler, DeliverPluginEventHandler, SwitchOffChangedPluginHandler,
                RecordPluginFaultHandler, ClearPluginFaultsHandler, AddPluginOutputHandler,
                ClearPluginQueueFileHandler]
    settings = [SettingValue("hold_window_ms", "Plugin answer limit", "The most milliseconds a plugin may take to answer an event it holds before the agent goes on.",
                             SettingType.NUMBER, default=50, scope=SettingScope.PROJECT),
                SettingValue("condition_limit_seconds", "Service condition limit", "The most seconds a plugin service's condition may take before it counts as failed.",
                             SettingType.NUMBER, default=10, scope=SettingScope.PROJECT)]
    driver_rules = [PluginRule, PluginProgramRule]
    bindings = {ProjectReads: PluginProjectReads}
    declared_plugin_events = [*PLAIN_EVENTS.values(), "tool_starting", "command_starting", "file_edited"]
    marks = PLUGIN_MARKS
    tick_handlers = [TickHandler(TickInterval(seconds=1), PluginCardReading(), "plugin card reading"),
                     TickHandler(TickInterval(seconds=5), PluginConfigReading(), "plugin config reading", starts_immediately=True),
                     TickHandler(TickInterval(seconds=60), OrphanServiceStopping(), "orphan plugin service stopping"),
                     TickHandler(TickInterval(seconds=24 * 60 * 60), DeliveryPruning(), "plugin delivery pruning", starts_immediately=True)]
    guards = [PluginEventGuard]
    listeners = [PluginServicesRemovalListener, PluginServicesUpgradeListener, PluginWrongKeyMarkListener, PluginEventListener, SystemEventDeliveryListener, LoginPathListener, PluginSkillPublishListener, JournalInstructionFileListener, StaleManagedHooksListener, PluginDeliveryListener, PluginHealthMarkListener, PluginOutputListener, PluginQueueFileListener]
    subcommands = [ChangePluginServiceSubcommand, LogPluginLineSubcommand, PostPluginCardSubcommand, PluginTrySubcommand, PluginEventsSubcommand, RunPluginCommandSubcommand, PluginCheckoutSubcommand, PluginPathSubcommand, RefreshPluginConfigSubcommand, PluginChangesSubcommand, PluginFileSubcommand, PluginRecordSubcommand, PluginListSubcommand, PluginSettingsSubcommand, PluginServicesSubcommand, PluginServiceLogSubcommand, UpgradePluginSubcommand, PluginPreviewSubcommand, PluginLatestSubcommand, PluginDashboardSubcommand, PluginDashboardsSubcommand, PluginDescriptionsSubcommand, ProposePluginSubcommand, InstallPluginSubcommand, EnablePluginSubcommand,
                   DisablePluginSubcommand, ConfigurePluginSubcommand, RemovePluginSubcommand]
