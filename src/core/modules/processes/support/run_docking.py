from collections import defaultdict

from engine.driver.interval import Interval
from engine.driver.span_queries import SpanQueries
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.support.dock_room import DockRoom
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_visibility import RunVisibility

from engine.driver.hook_event import HookEvent
from engine.database.database import Database
from engine.request.request_values import RequestValues
from engine.time.clock import Clock

from core.modules.processes.support.docked_runs import DockedRuns
DOCK_RUNS_REASON = "every long run the dock considers is read with its parts and output"


RUNS_CONSIDERED = 2


LONG_RUN_DOCK_KEY = "processes.long-run-dock"


class RunDocking:
    """Docks visible runs after the dock seconds of running, time in the queue left out. It looks at the two oldest
    runs not yet docked in a hook, so a hook that finds many runs due costs a few rows and docks them over the next
    hooks. Read once a hook; the name a run lacks is asked by its own request row, never by the dock."""

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, visibility: RunVisibility, queries: Queries, room: DockRoom, settings: ProcessSettings,
                 spans: SpanQueries, clock: Clock, request_values: RequestValues, database: Database) -> None:
        self.processes, self.folder, self.visibility = processes, folder, visibility
        self.queries, self.room, self.settings, self.spans, self.clock, self.request_values, self.database = queries, room, settings, spans, clock, request_values, database

    def docked(self, event: HookEvent | None, agent_id: int) -> DockedRuns:
        # read once a hook whatever changes meanwhile: a run it docks is no longer new to the next read
        return self.request_values.step_value(f"processes.dock:{agent_id}", HookEvent.step_key(event), lambda: self.found(agent_id))

    def found(self, agent_id: int) -> DockedRuns:
        current_time = self.clock.timestamp()
        dock = Interval(self.settings.seconds(ProcessSetting.DOCK_AFTER_SECONDS))
        runs = self.processes.agent(agent_id)
        docked = self.docked_runs(agent_id)
        new = tuple(runs.running().new_long_runs(current_time, dock.seconds).oldest().take(RUNS_CONSIDERED))
        if not docked and not new:
            return DockedRuns(())
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.queries.query(ProcessPart).matching(Among("process_id", [process.id for process in new])).every_row(DOCK_RUNS_REASON):
            parts[part.process_id].append(part)
        due = [process for process in new if self.requires_dock(process, agent_id, dock, tuple(parts[process.id]))]
        placed = due[:self.room.places(ProcessDockType.OUTPUT.value)]
        return DockedRuns(tuple(AddDockItem(ProcessDockType.OUTPUT.value, process.model_name, process.id) for process in placed))

    # the agent's docked runs, read once a request
    def docked_runs(self, agent_id: int) -> tuple[Process, ...]:
        return self.request_values.read(f"processes.docked:{agent_id}", self.database.change_mark, lambda: tuple(self.processes.agent(agent_id).running().docked_runs().get()))

    def requires_dock(self, process: Process, agent_id: int, dock: Interval, parts: tuple[ProcessPart, ...]) -> bool:
        if process.started_at is None or not dock.has_passed(self.spans, agent_id, process.started_at, self.clock.timestamp()) or self.visibility.select_visible_part(process, parts) is None or self.folder.end(process.id) is not None:
            return False
        return True
