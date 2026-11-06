from collections.abc import Callable, Mapping

from core.base.clock import Clock
from core.base.error_log import ErrorLog
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.timestamp import Timestamp
from core.base.command.bus import Bus
from core.base.command.server_stopping_error import ServerStoppingError
from core.base.model.event_form import EventForm
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.script_stop import ScriptStop
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.switch_off_changed_plugin.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.plugin_stopped_error import PluginStoppedError
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.plugins_module_name import MODULE_NAME


MOST_RUNNING_SCRIPTS = 8
FAILING_RETRY_SECONDS = 300


class PluginEventRunner:
    """Runs plugin guard and listen scripts and records failures and skipped runs."""

    def __init__(self, queries: Queries, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, clock: Clock, bus: Bus, actors: ModuleActors, scripts: PluginScriptProcesses, errors: ErrorLog) -> None:
        self.queries, self.folders, self.program, self.settings, self.clock, self.bus, self.actors, self.scripts, self.errors = queries, folders, program, settings, clock, bus, actors, scripts, errors

    def answer(self, subscription: PluginSubscription, form: EventForm, key: str, data: Mapping[str, object], environment_id: int | None, agent_id: int | None, wait_callback: Callable[[], None]) -> PluginEventAnswer | None:
        plugin = self.queries.query(Plugin).filter(id=subscription.plugin_id).first()
        if plugin is None or not plugin.enabled:
            return None
        if not self.may_try(plugin, key, form):
            return None
        location = f"at {key} ({form.value})"
        try:
            manifest = PluginManifest.read(self.folders.code(plugin.name))
        except Refusal as refusal:
            self.record(RecordPluginFault(plugin.id, f"{refusal.reason} {location}"))
            return None
        if not self.may_run(plugin, manifest):
            return None
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        call = PluginCall(manifest, PluginEvent(key, data), environment, self.clock.timestamp(), self.settings.values(plugin, manifest), agent_id, form=form, script=subscription.script)
        try:
            answer = self.program.run(call, None, wait_callback)
        except PluginStoppedError as stopped:
            if stopped.stop is ScriptStop.SERVER:
                raise ServerStoppingError.plugin_wait(plugin.name, key) from stopped
            self.record(RecordPluginFault.from_error(plugin.id, stopped, location))
            return None
        except PluginFaultError as fault:
            self.record(RecordPluginFault.from_error(plugin.id, fault, location))
            return None
        if plugin.fault_count:
            self.record(ClearPluginFaults(plugin.id))
        return PluginEventAnswer(plugin.name, plugin.id, answer, subscription.allows_skip)

    def may_try(self, plugin: Plugin, key: str, form: EventForm) -> bool:
        checked_at = self.clock.timestamp()
        if len(self.scripts.running(plugin.name)) >= MOST_RUNNING_SCRIPTS:
            return self.record_skip(plugin, key, form, f"this plugin already runs {MOST_RUNNING_SCRIPTS} scripts", checked_at)
        if not plugin.failing:
            return True
        last_tried_at = self.scripts.failing_try(plugin.name) or plugin.update_timestamp()
        if last_tried_at.elapsed_seconds(checked_at) < FAILING_RETRY_SECONDS:
            return self.record_skip(plugin, key, form, "this plugin is failing, so it is tried once every 5 minutes", checked_at)
        self.scripts.keep_failing_try(plugin.name, checked_at)
        return True

    def record_skip(self, plugin: Plugin, key: str, form: EventForm, reason: str, checked_at: Timestamp) -> bool:
        self.errors.noted(f"{form.value} script of {plugin.name} at {key} was skipped: {reason}")
        self.scripts.skipped(plugin.name, key, form, reason, checked_at)
        return False

    def may_run(self, plugin: Plugin, manifest: PluginManifest, cause_id: int | None = None) -> bool:
        if self.folders.is_upgrading(plugin.name):
            return False
        if PluginDigest.digest(self.folders.code(plugin.name), manifest) == plugin.files_digest:
            return True
        self.record(SwitchOffChangedPlugin(plugin.id), cause_id)
        return False

    def record(self, command: RecordPluginFault | ClearPluginFaults | SwitchOffChangedPlugin, cause_id: int | None = None) -> None:
        self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=cause_id)
