from core.base.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import RUN_NAME
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility

DOCK_AFTER_SECONDS = 5


class LongRunDockRule(DriverRule):
    """A visible run, of any agent, that has gone on for more than 5 seconds docks its output above
    the chat, once, and the agent is told if its card has only the raw command to show; no other run does, nor
    one whose folder says it has ended already."""

    name = "processes.long-run-dock"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, items: DockItemQuery, outputs: OutputQuery, folder: OutputFolder, visibility: RunVisibility) -> None:
        self.processes, self.items, self.outputs, self.folder, self.visibility = processes, items, outputs, folder, visibility

    def answer(self, hook: AgentHook) -> RuleAnswer:
        running = tuple(self.processes.agent(hook.agent_id).running().all_rows())
        due = [process for process in running if self.needs_dock(process, hook)]
        if not due:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*self.title_nudges(due)).running(*(AddDockItem(process.environment_id, ProcessDockType.OUTPUT.value, "process", process.id) for process in due))

    def title_nudges(self, due: list[Process]) -> list[Nudge]:
        return [RUN_NAME.nudge(process=process.id) for process in due if not self.has_title(process)]

    def has_title(self, process: Process) -> bool:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return bool(kept) and bool(kept[0].title)

    def needs_dock(self, process: Process, hook: AgentHook) -> bool:
        if not self.visibility.is_visible(process) or process.creation_timestamp().elapsed_seconds(hook.timestamp) <= DOCK_AFTER_SECONDS or self.folder.end(process.id) is not None:
            return False
        return not self.items.type_items(ProcessDockType.OUTPUT.value).row_items("process", process.id).exists()
