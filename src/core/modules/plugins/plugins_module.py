from core.modules.plugins.windows.plugins_windows import PLUGINS_WINDOWS
from core.modules.plugins.models.declarations.queued_run_model_declaration import QueuedRunModelDeclaration
from core.modules.plugins.models.declarations.plugin_model_declaration import PluginModelDeclaration
from core.modules.plugins.models.declarations.plugin_setting_model_declaration import PluginSettingModelDeclaration
from core.modules.plugins.models.declarations.plugin_delivery_model_declaration import PluginDeliveryModelDeclaration
from core.modules.plugins.models.declarations.plugin_output_model_declaration import PluginOutputModelDeclaration
from core.modules.plugins.models.declarations.plugin_queue_file_model_declaration import PluginQueueFileModelDeclaration
from core.modules.plugins.settings.plugins_setting_values import PluginsSettingValues
from core.modules.plugins.skills.declarations.plugins_skills import PLUGINS_SKILLS
from core.modules.plugins.support.plugin_installed_names import PluginInstalledNames
from core.modules.processes.support.installed_plugins import InstalledPlugins
from core.modules.plugins.migrations.m012_queued_run_names import QueuedRunNamesMigration
from core.modules.plugins.migrations.m011_queued_runs import QueuedRunsMigration
from core.modules.plugins.commands.queue_plugin_run.queue_plugin_run_handler import QueuePluginRunHandler
from core.modules.plugins.commands.queue_plugin_run.queue_plugin_run_subcommand import QueuePluginRunSubcommand
from core.modules.plugins.commands.cancel_queued_run.cancel_queued_run_handler import CancelQueuedRunHandler
from core.modules.plugins.commands.cancel_queued_run.cancel_queued_run_subcommand import CancelQueuedRunSubcommand
from core.modules.plugins.commands.queued_run_read.queued_run_read_subcommand import QueuedRunReadSubcommand
from core.modules.plugins.commands.queued_run_show.queued_run_show_subcommand import QueuedRunShowSubcommand
from core.modules.plugins.listeners.queued_run_admission_listener import QueuedRunAdmissionListener
from core.modules.plugins.listeners.queued_run_end_listener import QueuedRunEndListener
from core.modules.processes.support.process_type_limits import ProcessTypeLimits
from core.modules.plugins.support.plugin_run_limits import PluginRunLimits
from core.modules.plugins.migrations.m010_environment_index import PluginRowsEnvironmentIndexMigration
from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line_handler import SendPluginStepLineHandler
from core.modules.plugins.commands.log_plugin_line.log_plugin_line_handler import LogPluginLineHandler
from core.modules.plugins.commands.log_plugin_line.log_plugin_line_subcommand import LogPluginLineSubcommand
from core.modules.plugins.migrations.m004_plugin_session import PluginSessionMigration
from core.modules.plugins.migrations.m003_plugin_output_index import PluginOutputIndexMigration
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
from engine.module.module import Module
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
from core.modules.plugins.commands.publish_plugin_readers.publish_plugin_readers_handler import PublishPluginReadersHandler
from core.modules.plugins.commands.switch_plugin.switch_plugin_handler import SwitchPluginHandler
from core.modules.plugins.listeners.plugin_delivery_listener import PluginDeliveryListener
from core.modules.plugins.listeners.plugin_health_mark_listener import PluginHealthMarkListener
from core.modules.plugins.listeners.plugin_output_listener import PluginOutputListener
from core.modules.plugins.listeners.plugin_queue_file_listener import PluginQueueFileListener
from core.modules.plugins.listeners.login_path_listener import LoginPathListener
from core.modules.plugins.listeners.journal_instruction_file_listener import JournalInstructionFileListener
from core.modules.plugins.listeners.plugin_skill_publish_listener import PluginSkillPublishListener
from core.modules.plugins.listeners.plugin_readers_listener import PluginReadersListener
from core.modules.plugins.listeners.plugin_readers_boot_listener import PluginReadersBootListener
from core.modules.plugins.listeners.stale_managed_hooks_listener import StaleManagedHooksListener
from core.modules.plugins.migrations.m001_plugins import PluginsTablesMigration
from core.modules.plugins.migrations.m002_plugin_queue_index import PluginQueueIndexMigration
from core.modules.plugins.migrations.m009_plain_column_names import PlainColumnNamesMigration
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from core.modules.plugins.rules.plugin_rule import PluginRule
from core.modules.plugins.rules.plugin_program_rule import PluginProgramRule
from core.modules.plugins.support.plugin_marks import PLUGIN_MARKS
from core.modules.plugins.upgrade.plugins_move import PluginsMove


class PluginsModule(Module):
    """Adds plugins: programs the user installs into the journal, switches on or off and configures, which
    an agent may only propose."""

    name = "journal.core.plugins"
    nudges = PLUGIN_NUDGES
    seed_reason = "a plugin is a program the user installs, which a demo has none of"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.chat", "journal.core.skills",
                    "journal.core.processes", "journal.core.agents", "journal.core.messages"]
    skills = PLUGINS_SKILLS
    models = [QueuedRunModelDeclaration, PluginModelDeclaration, PluginSettingModelDeclaration, PluginDeliveryModelDeclaration, PluginOutputModelDeclaration, PluginQueueFileModelDeclaration]
    moves = [PluginsMove]
    windows = PLUGINS_WINDOWS
    migrations = [QueuedRunsMigration, PlainColumnNamesMigration, PluginConfigMigration, PluginOutputEnvironmentMigration, PluginEventDeliveriesMigration, PluginSessionMigration, PluginOutputIndexMigration, PluginsTablesMigration, PluginQueueIndexMigration, PluginSettingEnvironmentsMigration, PluginRowsEnvironmentIndexMigration, QueuedRunNamesMigration]
    handlers = [QueuePluginRunHandler, CancelQueuedRunHandler, ChangePluginServiceHandler, LogPluginLineHandler, RefreshPluginConfigHandler, PrunePluginDeliveriesHandler, RunPluginCommandHandler, SendPluginStepLineHandler, DeliverFileEditHandler, UpgradePluginHandler, InstallPluginHandler, SwitchPluginHandler, ConfigurePluginHandler, RemovePluginHandler, DeliverPluginEventHandler, SwitchOffChangedPluginHandler, PublishPluginReadersHandler,
                RecordPluginFaultHandler, ClearPluginFaultsHandler, AddPluginOutputHandler,
                ClearPluginQueueFileHandler]
    settings = [PluginsSettingValues]
    driver_rules = [PluginRule, PluginProgramRule]
    bindings = {ProjectReads: PluginProjectReads, ProcessTypeLimits: PluginRunLimits, InstalledPlugins: PluginInstalledNames}
    declared_plugin_events = [*PLAIN_EVENTS.values(), "tool_starting", "command_starting", "file_edited"]
    marks = PLUGIN_MARKS
    tick_handlers = [TickHandler(TickInterval(seconds=1), PluginCardReading(), "plugin card reading"),
                     TickHandler(TickInterval(seconds=5), PluginConfigReading(), "plugin config reading", starts_immediately=True),
                     TickHandler(TickInterval(seconds=60), OrphanServiceStopping(), "orphan plugin service stopping"),
                     TickHandler(TickInterval(seconds=24 * 60 * 60), DeliveryPruning(), "plugin delivery pruning", starts_immediately=True)]
    guards = [PluginEventGuard]
    listeners = [QueuedRunAdmissionListener, QueuedRunEndListener, PluginServicesRemovalListener, PluginServicesUpgradeListener, PluginWrongKeyMarkListener, PluginEventListener, SystemEventDeliveryListener, LoginPathListener, PluginSkillPublishListener, PluginReadersListener, PluginReadersBootListener, JournalInstructionFileListener, StaleManagedHooksListener, PluginDeliveryListener, PluginHealthMarkListener, PluginOutputListener, PluginQueueFileListener]
    subcommands = [QueuePluginRunSubcommand, CancelQueuedRunSubcommand, QueuedRunReadSubcommand, QueuedRunShowSubcommand, ChangePluginServiceSubcommand, LogPluginLineSubcommand, PostPluginCardSubcommand, PluginTrySubcommand, PluginEventsSubcommand, RunPluginCommandSubcommand, PluginCheckoutSubcommand, PluginPathSubcommand, RefreshPluginConfigSubcommand, PluginChangesSubcommand, PluginFileSubcommand, PluginRecordSubcommand, PluginListSubcommand, PluginSettingsSubcommand, PluginServicesSubcommand, PluginServiceLogSubcommand, UpgradePluginSubcommand, PluginPreviewSubcommand, PluginLatestSubcommand, PluginDashboardSubcommand, PluginDashboardsSubcommand, PluginDescriptionsSubcommand, ProposePluginSubcommand, InstallPluginSubcommand, EnablePluginSubcommand,
                   DisablePluginSubcommand, ConfigurePluginSubcommand, RemovePluginSubcommand]
