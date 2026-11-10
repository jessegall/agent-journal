from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.model.event_form import EventForm
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.plugin_script_processes import PluginScriptProcesses
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_run import PluginRun
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.support.plugin_try_run import PluginTryRun
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

TRY_LIMIT_MS = 60_000


class PluginTry:
    """Runs a plugin script with a recent event, as a read: it records neither its answer nor its fault or clean run,
    and shows them instead."""

    def __init__(self, queries: Queries, registry: Registry, runnable: RunnablePlugins, runs: PluginRun, log: EventLog, clock: Clock, scripts: PluginScriptProcesses) -> None:
        self.queries, self.registry, self.runnable, self.runs, self.log, self.clock, self.scripts = queries, registry, runnable, runs, log, clock, scripts

    def run(self, name: str, key: str, agent_id: int | None, environment_id: int | None) -> PluginTryRun:
        plugin = self.queries.query(Plugin).filter(name=name).first()
        if plugin is None:
            raise Refusal(f"no plugin is called {name}", "journal plugin list shows them")
        event = self.registry.event_name(key)
        if not event:
            raise Refusal(f"no event has the key {key}", "journal event keys lists them")
        check = self.runnable.check(plugin)
        if check.runnable is None:
            raise Refusal(f"{name} cannot run now: {check.reason}", f"journal plugin record {name} shows it")
        manifest = check.runnable.manifest
        form = next((form for form in EventForm if manifest.script(key, form)), None)
        if form is None:
            raise Refusal(f"{name} has no script on {key}", f"journal plugin events {name} lists what it listens to")
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        request = PluginRunRequest(check.runnable, PluginEvent(key, self.data(event, form)), form, TRY_LIMIT_MS, f"at {key}", environment, self.clock.timestamp(), agent_id, manifest.script(key, form))
        line = self.runs.line(request)
        skip = self.scripts.newest_skip(plugin.name, key, form).reason if self.scripts.has_skip(plugin.name, key, form) else None
        outcome = self.runs.run(request)
        if outcome.answer is None:
            return PluginTryRun(line, skip, fault=outcome.fault_text)
        return PluginTryRun(line, skip, answer=outcome.answer.output)

    def data(self, event: str, form: EventForm) -> dict[str, object]:
        logged = self.log.latest_event(event)
        if logged is None:
            return {"form": form.value, "final": form is EventForm.COMMIT, "log_name": event, "event_id": None, "row": {}, "old_row": {}, "changed": {}}
        actor_type = self.queries.query(ActorRecord).find(logged.actor_id).type.value
        row = {name: values[1] for name, values in logged.data.items()}
        old_row = {name: values[0] for name, values in logged.data.items()}
        return {**PluginPayload.logged(logged, actor_type, row, old_row), "form": form.value, "final": form is EventForm.COMMIT}
