from collections.abc import Callable, Mapping

from core.base.clock import Clock
from core.base.error_log import ErrorLog
from core.base.running_scripts import RunningScripts
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
    """Runs one plugin's guard or listen script with no time limit and no lock held. A plugin that was switched off
    meanwhile or is being upgraded is left out, one whose files changed is switched off, and a fault is recorded on
    the plugin, so the change goes on. A plugin with too many scripts running is left out, and so is a failing one,
    except for one try every few minutes, or nothing could ever clear its mark."""

    def __init__(self, queries: Queries, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, clock: Clock, bus: Bus, actors: ModuleActors, scripts: RunningScripts, errors: ErrorLog) -> None:
        self.queries, self.folders, self.program, self.settings, self.clock, self.bus, self.actors, self.scripts, self.errors = queries, folders, program, settings, clock, bus, actors, scripts, errors

    def answer(self, subscription: PluginSubscription, form: EventForm, key: str, data: Mapping[str, object], environment_id: int | None, agent_id: int | None, on_wait: Callable[[], None]) -> PluginEventAnswer | None:
        plugin = self.queries.query(Plugin).filter(id=subscription.plugin_id).first()
        if plugin is None or not plugin.enabled:
            return None
        if not self.may_try(plugin, key, form):
            return None
        where = f"at {key} ({form.value})"
        try:
            manifest = PluginManifest.read(self.folders.code(plugin.name))
        except Refusal as refusal:
            self.record(RecordPluginFault(plugin.id, f"{refusal.reason} {where}"))
            return None
        if not self.may_run(plugin, manifest):
            return None
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        call = PluginCall(manifest, PluginEvent(key, data), environment, self.clock.timestamp(), self.settings.values(plugin, manifest), agent_id, form=form, script=subscription.script)
        try:
            answer = self.program.run(call, None, on_wait)
        except PluginStoppedError as stopped:
            if stopped.stop is ScriptStop.SERVER:
                raise ServerStoppingError.before(plugin.name, key) from stopped
            self.record(RecordPluginFault.of(plugin.id, stopped, where))
            return None
        except PluginFaultError as fault:
            self.record(RecordPluginFault.of(plugin.id, fault, where))
            return None
        if plugin.fault_count:
            self.record(ClearPluginFaults(plugin.id))
        return PluginEventAnswer(plugin.name, plugin.id, answer, subscription.allows_skip)

    def may_try(self, plugin: Plugin, key: str, form: EventForm) -> bool:
        now = self.clock.timestamp()
        if len(self.scripts.running(plugin.name)) >= MOST_RUNNING_SCRIPTS:
            return self.left_out(plugin, key, form, f"this plugin already runs {MOST_RUNNING_SCRIPTS} scripts", now)
        if not plugin.failing:
            return True
        last_try = self.scripts.failing_try(plugin.name) or plugin.update_timestamp()
        if last_try.elapsed_seconds(now) < FAILING_RETRY_SECONDS:
            return self.left_out(plugin, key, form, "this plugin is failing, so it is tried once every 5 minutes", now)
        self.scripts.keep_failing_try(plugin.name, now)
        return True

    def left_out(self, plugin: Plugin, key: str, form: EventForm, reason: str, now: Timestamp) -> bool:
        self.errors.noted(f"{form.value} script of {plugin.name} at {key} was skipped: {reason}")
        self.scripts.skipped(plugin.name, key, form, reason, now)
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
