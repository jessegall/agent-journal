from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery

DOCK_AFTER_SECONDS = 5


class LongRunDockRule(DriverRule):
    """A run of the agent's that has gone on for more than 5 seconds docks its output above the
    chat, once, and the agent is told if its card has only the raw command to show; a journal command never does."""

    name = "processes.long-run-dock"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, items: DockItemQuery, outputs: OutputQuery) -> None:
        self.processes, self.items, self.outputs = processes, items, outputs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        running = tuple(self.processes.agent(hook.agent_id).running().all_rows())
        due = [process for process in running if self.needs_dock(process, hook)]
        if not due:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*self.title_lines(due)).running(*(AddDockItem(process.environment_id, ProcessDockType.OUTPUT.value, "process", process.id) for process in due))

    def title_lines(self, due: list[Process]) -> list[str]:
        return [f'output {process.id} is docked with its raw command as its title: name what it does with journal output title {process.id} "<what it does>", or give its reader a --title'
                for process in due if not self.has_title(process)]

    def has_title(self, process: Process) -> bool:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return bool(kept) and bool(kept[0].title)

    def needs_dock(self, process: Process, hook: AgentHook) -> bool:
        if process.category is CommandCategory.JOURNAL or process.creation_timestamp().elapsed_seconds(hook.timestamp) <= DOCK_AFTER_SECONDS:
            return False
        return not self.items.type_items(ProcessDockType.OUTPUT.value).row_items("process", process.id).exists()
