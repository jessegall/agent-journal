from collections import defaultdict

from core.base.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import RUN_NAME
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_room import DockRoom
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.run_title import RunTitle

DOCK_AFTER_SECONDS = 5


class LongRunDockRule(DriverRule):
    """Docks visible runs after five seconds of running, time in the queue left out, and asks for a name when a
    docked run has none."""

    name = "processes.long-run-dock"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, items: DockItemQuery, outputs: OutputQuery, folder: OutputFolder, visibility: RunVisibility, queries: Queries, room: DockRoom) -> None:
        self.processes, self.items, self.outputs, self.folder, self.visibility = processes, items, outputs, folder, visibility
        self.queries, self.room = queries, room

    def answer(self, hook: AgentHook) -> RuleAnswer:
        running = tuple(self.processes.agent(hook.agent_id).running().long_run_candidates(hook.timestamp, DOCK_AFTER_SECONDS).all_rows())
        if not running:
            return RuleAnswer.allowed()
        ids = [process.id for process in running]
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.queries.query(ProcessPart).matching(Among("process_id", ids)).oldest().all_rows():
            parts[part.process_id].append(part)
        outputs = {output.process_id: output for output in self.outputs.matching(Among("process_id", ids)).all_rows()}
        items = tuple(self.items.type_items(ProcessDockType.OUTPUT.value).filter(target_model="process").matching(Among("target_id", ids)).all_rows())
        existing = {item.target_id for item in items}
        due = [process for process in running if process.id not in existing and self.needs_dock(process, hook, tuple(parts[process.id]))]
        placed = due[:self.room.places(ProcessDockType.OUTPUT.value)]
        docked = {item.target_id for item in items if item.state is DockItemState.DOCKED}
        shown = [process for process in running if process.id in docked or process in placed]
        return RuleAnswer.with_nudges(*self.title_nudges(shown, outputs)).running(*(AddDockItem(ProcessDockType.OUTPUT.value, process.model_name, process.id) for process in placed))

    def title_nudges(self, due: list[Process], outputs: dict[int, Output]) -> list[Nudge]:
        return [RUN_NAME.nudge(process=process.id) for process in due if process.id not in outputs or not RunTitle.is_descriptive(outputs[process.id].title, process.line)]

    def needs_dock(self, process: Process, hook: AgentHook, parts: tuple[ProcessPart, ...]) -> bool:
        if process.started_at is None or process.started_at.elapsed_seconds(hook.timestamp) <= DOCK_AFTER_SECONDS or self.visibility.select_visible_part(process, parts) is None or self.folder.end(process.id) is not None:
            return False
        return True

