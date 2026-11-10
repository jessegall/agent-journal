from collections.abc import Callable, Mapping

from core.base.clock import Clock
from engine.enums.log_level import LogLevel
from core.base.system_log_writer import SystemLogWriter
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.timestamp import Timestamp
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.model.event_form import EventForm
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_run import PluginRun
from core.modules.plugins.support.plugin_run_check import PluginRunCheck
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


MOST_RUNNING_SCRIPTS = 8
FAILING_RETRY_SECONDS = 300


class PluginEventRunner:
    """Runs plugin guard and listen scripts and records failures and skipped runs."""

    def __init__(self, queries: Queries, runnable: RunnablePlugins, runs: PluginRun, clock: Clock, bus: Bus, actors: ModuleActors, scripts: PluginScriptProcesses, system_log: SystemLogWriter) -> None:
        self.queries, self.runnable, self.runs, self.clock, self.bus, self.actors, self.scripts, self.system_log = queries, runnable, runs, clock, bus, actors, scripts, system_log

    def answer(self, subscription: PluginSubscription, form: EventForm, key: str, data: Mapping[str, object], environment_id: int | None, agent_id: int | None, wait_callback: Callable[[], None]) -> PluginEventAnswer | None:
        plugin = self.queries.query(Plugin).filter(id=subscription.plugin_id).first()
        if plugin is None or not plugin.enabled:
            return None
        if not self.may_try(plugin, key, form):
            return None
        location = f"at {key} ({form.value})"
        check = self.runnable.check(plugin)
        if check.runnable is None:
            self.record_check(check, location)
            return None
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        request = PluginRunRequest(check.runnable, PluginEvent(key, data), form, subscription.limit_ms, location, environment, self.clock.timestamp(), agent_id, subscription.script, wait_callback=wait_callback)
        outcome = self.runs.recorded_run(request)
        if outcome.is_late:
            self.note_late(plugin, form, key, subscription.limit_ms)
        answer = outcome.answer
        return None if answer is None else PluginEventAnswer(plugin.name, plugin.id, answer, subscription.allows_skip)

    def note_late(self, plugin: Plugin, form: EventForm, key: str, limit_ms: int | None) -> None:
        self.system_log.write(LogLevel.WARNING, f"Plugin {plugin.name} did not answer its {form.value} of {key} within {limit_ms} ms, so the change went through unjudged.")

    def may_try(self, plugin: Plugin, key: str, form: EventForm) -> bool:
        checked_at = self.clock.timestamp()
        if len(self.scripts.running(plugin.name)) >= MOST_RUNNING_SCRIPTS:
            return self.record_skip(plugin, key, form, f"this plugin already runs {MOST_RUNNING_SCRIPTS} scripts", checked_at)
        if not plugin.failing:
            return True
        last_tried_at = self.scripts.failing_try(plugin.name, plugin.update_timestamp())
        if last_tried_at.elapsed_seconds(checked_at) < FAILING_RETRY_SECONDS:
            return self.record_skip(plugin, key, form, "this plugin is failing, so it is tried once every 5 minutes", checked_at)
        self.scripts.keep_failing_try(plugin.name, checked_at)
        return True

    def record_skip(self, plugin: Plugin, key: str, form: EventForm, reason: str, checked_at: Timestamp) -> bool:
        self.system_log.write(LogLevel.WARNING, f"{form.value} script of {plugin.name} at {key} was skipped: {reason}")
        self.scripts.skipped(plugin.name, key, form, reason, checked_at)
        return False

    def record_check(self, check: PluginRunCheck, location: str, cause_id: int | None = None) -> None:
        for command in check.records(location):
            self.record(command, cause_id)

    def record(self, command: Command[object], cause_id: int | None = None) -> None:
        self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=cause_id)
