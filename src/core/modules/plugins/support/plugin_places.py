from collections.abc import Collection, Iterable

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.module.module_actors import ModuleActors
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.environments.models.environment import Environment
from core.modules.plugins.support.no_plugin_place import NoPluginPlace
from core.modules.plugins.support.plugin_place import PluginPlace
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from engine.time.polled_wait import PolledWait

PLUGIN_RUNS_REASON = "every running run of a plugin no longer wanted is stopped"

PLACE_POLL_SECONDS = 0.05


class PluginPlaces:
    """A plugin's own processes in the journal's process queue: each takes a row under the plugin's name,
    waits there for its place, and ends the row when the process ends. A process that must run at once, a
    service or a program held inside a hook's window, is admitted without taking one of the places tests
    wait for. The row belongs to the agent the process came from, or else the running main agent of its
    environment."""

    def __init__(self, bus: Bus, queries: Queries, actors: ModuleActors, scopes: Scopes) -> None:
        self.bus, self.queries, self.actors, self.scopes = bus, queries, actors, scopes

    def queue_place(self, plugin: str, line: str, category: CommandCategory, folder: str, agent_id: int | None, environment: str) -> PluginPlace:
        agents = self.session_agents(agent_id, environment)
        if not agents:
            return NoPluginPlace()
        start = StartProcess.single_part(agents[0].id, line, folder, category, 0, plugin)
        return PluginPlace(self.bus.run(start, self.actors.actor(MODULE_NAME), environment_id=agents[0].environment_id).id, self)

    def session_agents(self, agent_id: int | None, environment: str) -> tuple[Agent, ...]:
        if agent_id is not None:
            return tuple([self.queries.query(Agent).find(agent_id)])
        environments = tuple(self.queries.query(Environment).filter(name=environment).get()) if environment else ()
        if not environments:
            return MainAgentFinder.rows(self.queries)
        with self.scopes.opened(None, environments[0].id):
            return MainAgentFinder.rows(self.queries)

    def wait(self, process_id: int, limit_seconds: float) -> bool:
        PolledWait(limit_seconds, PLACE_POLL_SECONDS).poll(lambda: self.has_exited_queue(process_id))
        process = self.queries.query(Process).find(process_id)
        return process.ended_at is None and process.queued_at is None

    def has_exited_queue(self, process_id: int) -> bool:
        process = self.queries.query(Process).find(process_id)
        return process.ended_at is not None or process.queued_at is None

    def leave(self, process_id: int, exit_code: int) -> None:
        if self.queries.query(Process).find(process_id).ended_at is None:
            self.bus.run(EndProcess(process_id, exit_code, 0, 0), self.actors.actor(MODULE_NAME))

    def stop(self, plugin: str) -> None:
        self.stop_rows(process for process in self.running() if process.plugin == plugin)

    def stop_unwanted(self, wanted: Collection[str]) -> None:
        self.stop_rows(process for process in self.running() if process.plugin not in wanted)

    def running(self) -> list[Process]:
        return [process for process in self.queries.query(Process).matching(Among("state", RUNNING_STATES)).every_row(PLUGIN_RUNS_REASON) if process.plugin]

    def stop_rows(self, processes: Iterable[Process]) -> None:
        for process in processes:
            self.bus.run(StopProcess(process.id), self.actors.actor(MODULE_NAME))
