from collections import defaultdict

from engine.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import RUN_NAME
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from engine.driver.span_queries import SpanQueries
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.support.dock_room import DockRoom
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.run_title import RunTitle

DOCK_RUNS_REASON = "every long run the dock considers is read with its parts and output"


RUNS_CONSIDERED = 2


class LongRunDockRule(DriverRule):
    """Docks visible runs after the dock seconds of running, time in the queue left out, and asks for a
    name when a docked run has none. It looks at the two oldest runs not yet docked in a hook, so a
    hook that finds many runs due costs a few rows and docks them over the next hooks."""

    name = "processes.long-run-dock"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery, folder: OutputFolder, visibility: RunVisibility, queries: Queries, room: DockRoom, settings: ProcessSettings, spans: SpanQueries) -> None:
        self.processes, self.outputs, self.folder, self.visibility = processes, outputs, folder, visibility
        self.queries, self.room, self.settings, self.spans = queries, room, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        dock = Interval(self.settings.seconds(ProcessSetting.DOCK_AFTER_SECONDS))
        runs = self.processes.agent(hook.agent_id)
        docked = tuple(runs.running().docked_runs().get())
        new = tuple(runs.running().fresh_long_runs(hook.timestamp, dock.seconds).oldest().take(RUNS_CONSIDERED))
        if not docked and not new:
            return RuleAnswer.allowed()
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.queries.query(ProcessPart).matching(Among("process_id", [process.id for process in new])).every_row(DOCK_RUNS_REASON):
            parts[part.process_id].append(part)
        due = [process for process in new if self.needs_dock(process, hook, dock, tuple(parts[process.id]))]
        placed = due[:self.room.places(ProcessDockType.OUTPUT.value)]
        shown = [*docked, *placed]
        outputs = {output.process_id: output for output in self.outputs.matching(Among("process_id", [process.id for process in shown])).every_row(DOCK_RUNS_REASON)} if shown else {}
        titles = self.title_nudges(shown, outputs)
        return RuleAnswer.with_nudges(*titles).running(*(AddDockItem(ProcessDockType.OUTPUT.value, process.model_name, process.id) for process in placed))

    def title_nudges(self, due: list[Process], outputs: dict[int, Output]) -> list[Nudge]:
        return [RUN_NAME.nudge(process=process.id) for process in due if process.id in outputs and not RunTitle.is_descriptive(outputs[process.id].title, process.line)]

    def needs_dock(self, process: Process, hook: AgentHook, dock: Interval, parts: tuple[ProcessPart, ...]) -> bool:
        if process.started_at is None or not dock.has_passed(self.spans, hook.agent_id, process.started_at, hook.timestamp) or self.visibility.select_visible_part(process, parts) is None or self.folder.end(process.id) is not None:
            return False
        return True

