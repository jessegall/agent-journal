from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.process import Process
from core.modules.processes.models.request_run import RequestRun
from tests.stories.core.support.coding_fixtures import BuilderStarted


def runs_of_kind(story, kind: ProcessKind) -> list[RequestRun]:
    return list(story.container.get(Queries).query(RequestRun).filter(kind=kind.value).all_rows())


def test_each_hook_leaves_one_ended_request_row_of_the_hook_kind_and_no_process_row(new_story):
    story = new_story(fixture=BuilderStarted)
    processes_before = story.container.get(Queries).query(Process).count()
    story.hook("s-1", HookSamples.sample("stop"))
    rows = [row for row in runs_of_kind(story, ProcessKind.HOOK) if row.line == "claude stop"]
    story.expect_rows(len(rows) == 1, rows[0].exit_code == 0, rows[0].session_agent_id == story.agent.id,
                      story.container.get(Queries).query(Process).count() == processes_before, detail=str(rows))


def test_a_quick_run_through_the_door_leaves_one_ended_request_row(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = story.container.get(ProcessExecutor).execute(ExecutionRequest(["echo", "done"], story.home.project_folder, ProcessKind.QUICK, 10))
    rows = runs_of_kind(story, ProcessKind.QUICK)
    story.expect_rows(execution.stdout == "done\n", len(rows) == 1, rows[0].id == execution.process_id, rows[0].exit_code == 0, detail=str(rows))


def test_a_failing_run_through_the_door_keeps_its_code(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = story.container.get(ProcessExecutor).execute(ExecutionRequest(["sh", "-c", "exit 3"], story.home.project_folder, ProcessKind.SHELL, 10))
    row = runs_of_kind(story, ProcessKind.SHELL)[0]
    story.expect_rows(execution.exit_code == 3, row.exit_code == 3, detail=str(row))
