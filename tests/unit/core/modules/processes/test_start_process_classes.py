from engine.execution.person_classes import PersonClasses
from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_classes import ExecutionClasses
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.support.process_classes import ProcessClasses

MAIN = Agent(id=1, creator_id=1, session="s-1", program="claude", role="main")
WORKER = Agent(id=2, creator_id=1, session="s-2", program="claude", role="worker")
HELPER = Agent(id=3, creator_id=1, session="s-3", program="claude", role="helper")


class NoPersonClasses(PersonClasses):
    """No class of the person's own."""

    def classes(self) -> tuple:
        return ()


CHOICE = ProcessClasses(ExecutionClasses(NoPersonClasses()))


def start(line: str, *categories: CommandCategory, plugin: str = "", run_name: str = "") -> StartProcess:
    parts = [PartSpec(text=line, program=line.split()[0], category=category) for category in categories]
    return StartProcess(agent_id=1, hook_call_id=None, line=line, folder=".", category=categories[0], limit_seconds=60, parts=parts, plugin=plugin, run_name=run_name)


def test_worker_grep_row_is_short_agent():
    chosen = CHOICE.chosen(start("grep x", CommandCategory.SEARCH), WORKER)
    assert (chosen.lane, chosen.priority) == (ExecutionLane.SHORT, ExecutionPriority.AGENT)


def test_worker_pytest_row_is_long_agent():
    chosen = CHOICE.chosen(start("pytest", CommandCategory.TEST_RUN), WORKER)
    assert (chosen.lane, chosen.priority, chosen.slot_cost) == (ExecutionLane.LONG, ExecutionPriority.AGENT, 4)


def test_main_agent_read_row_is_immediate_and_not_queued():
    assert CHOICE.chosen(start("cat a.py", CommandCategory.READ), MAIN).priority is ExecutionPriority.IMMEDIATE


def test_helper_pytest_waits_at_agent():
    assert CHOICE.chosen(start("pytest", CommandCategory.TEST_RUN), HELPER).priority is ExecutionPriority.AGENT


def test_mixed_line_takes_longest_lane_and_highest_cost():
    chosen = CHOICE.chosen(start("ls && npm install && pytest", CommandCategory.READ, CommandCategory.PACKAGE, CommandCategory.TEST_RUN), WORKER)
    assert (chosen.lane, chosen.slot_cost) == (ExecutionLane.LONG, 4)


def test_plugin_row_keeps_the_plugin_class():
    chosen = CHOICE.chosen(start("sample check", CommandCategory.CHECK, plugin="sample", run_name="merge"), WORKER)
    assert chosen.name == "sample merge"
