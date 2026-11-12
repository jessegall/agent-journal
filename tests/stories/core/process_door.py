from engine.enums.process_kind import ProcessKind
from engine.process.execution_request import ExecutionRequest
from engine.process.process_executor import ProcessExecutor
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def rows_of_kind(story, kind: ProcessKind) -> list[Process]:
    return list(story.container.get(Queries).query(Process).filter(kind=kind.value).all_rows())


def test_each_hook_leaves_one_finished_process_row_of_the_hook_kind(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("stop"))
    rows = [row for row in rows_of_kind(story, ProcessKind.HOOK) if row.line == "claude stop"]
    story.expect_rows(len(rows) == 1, rows[0].state is ProcessState.FINISHED, rows[0].session_agent_id == story.agent.id, not rows[0].slot_assigned, detail=str(rows))


def test_a_quick_run_through_the_door_leaves_a_finished_row_and_takes_no_place(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = story.container.get(ProcessExecutor).execute(ExecutionRequest(["echo", "done"], story.home.project_folder, ProcessKind.QUICK, 10))
    rows = rows_of_kind(story, ProcessKind.QUICK)
    story.expect_rows(execution.stdout == "done\n", len(rows) == 1, rows[0].id == execution.process_id, rows[0].state is ProcessState.FINISHED, not rows[0].slot_assigned,
                      detail=str(rows))


def test_a_failing_run_through_the_door_ends_its_row_failed_with_its_code(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = story.container.get(ProcessExecutor).execute(ExecutionRequest(["sh", "-c", "exit 3"], story.home.project_folder, ProcessKind.SHELL, 10))
    row = rows_of_kind(story, ProcessKind.SHELL)[0]
    story.expect_rows(execution.exit_code == 3, row.state is ProcessState.FAILED, row.exit_code == 3, detail=str(row))
