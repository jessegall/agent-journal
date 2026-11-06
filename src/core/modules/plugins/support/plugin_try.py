from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.model.event_form import EventForm
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.running_scripts import PluginScriptProcesses
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.plugin_try_run import PluginTryRun

TRY_LIMIT_MS = 60_000


class PluginTry:
    """Runs a plugin script with a recent event without applying its answer or recording faults."""

    def __init__(self, queries: Queries, registry: Registry, folders: PluginFolders, log: EventLog, program: PluginProgram, settings: PluginSettings, clock: Clock, scripts: PluginScriptProcesses) -> None:
        self.queries, self.registry, self.folders, self.log, self.program, self.settings, self.clock, self.scripts = queries, registry, folders, log, program, settings, clock, scripts

    def run(self, name: str, key: str, agent_id: int | None, environment_id: int | None) -> PluginTryRun:
        plugin = self.queries.query(Plugin).filter(name=name).first()
        if plugin is None:
            raise Refusal(f"no plugin is called {name}", "journal plugin list shows them")
        event = self.registry.event_name(key)
        if not event:
            raise Refusal(f"no event has the key {key}", "journal event keys lists them")
        manifest = PluginManifest.read(self.folders.code(plugin.name))
        form = next((form for form in EventForm if manifest.script(key, form)), None)
        if form is None:
            raise Refusal(f"{name} has no script on {key}", f"journal plugin events {name} lists what it listens to")
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        call = PluginCall(manifest, PluginEvent(key, self.data(event, form)), environment, self.clock.timestamp(), self.settings.values(plugin, manifest), agent_id, form=form, script=manifest.script(key, form))
        line, skipped = self.program.line(call, TRY_LIMIT_MS), self.scripts.newest_skip(plugin.name, key, form)
        skip = skipped.reason if skipped else ""
        try:
            return PluginTryRun(line, self.program.run(call, TRY_LIMIT_MS).output, "", skip)
        except PluginFaultError as fault:
            return PluginTryRun(line, "", str(fault), skip)

    def data(self, event: str, form: EventForm) -> dict[str, object]:
        logged = self.log.latest_event(event)
        if logged is None:
            return {"form": form.value, "final": form is EventForm.COMMIT, "log_name": event, "event_id": None, "row": {}, "old_row": {}, "changed": {}}
        actor_type = self.queries.query(ActorRecord).find(logged.actor_id).type.value
        row = {name: values[1] for name, values in logged.data.items()}
        old_row = {name: values[0] for name, values in logged.data.items()}
        return {**PluginPayload.logged(logged, actor_type, row, old_row), "form": form.value, "final": form is EventForm.COMMIT}
