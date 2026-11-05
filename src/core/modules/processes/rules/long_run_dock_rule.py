from core.base.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import RUN_NAME
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
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

    def __init__(self, processes: ProcessQuery, items: DockItemQuery, outputs: OutputQuery, folder: OutputFolder, visibility: RunVisibility) -> None:
        self.processes, self.items, self.outputs, self.folder, self.visibility = processes, items, outputs, folder, visibility

    def answer(self, hook: AgentHook) -> RuleAnswer:
        running = tuple(self.processes.agent(hook.agent_id).running().long_run_candidates(hook.timestamp, DOCK_AFTER_SECONDS).all_rows())
        due = [process for process in running if self.needs_dock(process, hook)]
        docked = {item.target_id for item in self.items.type_items(ProcessDockType.OUTPUT.value).filter(state=DockItemState.DOCKED, target_model="process").all_rows()}
        shown = [process for process in running if process.id in docked or process in due]
        return RuleAnswer.with_nudges(*self.title_nudges(shown)).running(*(AddDockItem(process.environment_id, ProcessDockType.OUTPUT.value, "process", process.id) for process in due))

    def title_nudges(self, due: list[Process]) -> list[Nudge]:
        return [RUN_NAME.nudge(process=process.id) for process in due if not self.has_title(process)]

    def has_title(self, process: Process) -> bool:
        kept = self.outputs.process(process.id).limited(1)
        return bool(kept) and RunTitle.is_descriptive(kept[0].title, process.line)

    def needs_dock(self, process: Process, hook: AgentHook) -> bool:
        if process.started_at is None or process.started_at.elapsed_seconds(hook.timestamp) <= DOCK_AFTER_SECONDS or not self.visibility.is_visible(process) or self.folder.end(process.id) is not None:
            return False
        return not self.items.type_items(ProcessDockType.OUTPUT.value).row_items("process", process.id).exists()
