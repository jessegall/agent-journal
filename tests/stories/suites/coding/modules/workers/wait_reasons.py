import json

from engine.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch

ENDED_AT = "2026-01-01T00:00:00+00:00"


def expect_reason(story, worker, reason):
    outcome = story.run("worker waits --environment main --json", actor=story.agent)
    assert outcome.code == 0, outcome.output_text
    rows = json.loads(outcome.output_text)["rows"]
    assert next(row["reason"] for row in rows if row["agent_id"] == worker.id) == reason


def test_a_worker_wait_reason_follows_tests_proof_check_and_merge(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    launches = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task edit 1 --brief "- the total\n- the review"', actor=story.agent)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the total" --test "python tests/cart.py"', actor=worker)
    story.expect_success('proof make 2 --task 1 "cart.py:1, the review"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_reason(story, worker, "tests")
        expect_browser(server, "workerWait.browser.mjs", [str(worker.id), "tests"])
        ended(story, launches[0], 0)
        expect_reason(story, worker, "proof check")
        expect_browser(server, "workerWait.browser.mjs", [str(worker.id), "proof check"])
        story.expect_success("proof check 2", actor=story.agent)
        expect_reason(story, worker, "merge")
        expect_browser(server, "workerWait.browser.mjs", [str(worker.id), "merge"])


def test_a_stopped_worker_with_a_task_says_what_it_waits_on_and_never_for_a_job(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    database = story.container.get(Database)
    part = PartSpec("make test", "make", False, CommandCategory.TEST_RUN)
    command = StartProcess(worker.id, None, "make test", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, [part])
    process = story.container.get(Bus).run(command, worker, environment_id=1)
    database.update(Statement("UPDATE agents SET ended_at = ? WHERE id = ?", [ENDED_AT, worker.id]))
    expect_reason(story, worker, "reader")
    database.update(Statement("UPDATE reader_requests SET completed_at = ?", [ENDED_AT]))
    database.update(Statement("UPDATE processes SET queued_at = created_at WHERE id = ?", [process.id]))
    expect_reason(story, worker, "place in the queue")
    database.update(Statement("UPDATE processes SET queued_at = NULL WHERE id = ?", [process.id]))
    expect_reason(story, worker, "command to finish")
    database.update(Statement("UPDATE processes SET state = 'finished' WHERE id = ?", [process.id]))
    expect_reason(story, worker, "next start")


def test_a_worker_with_no_unfinished_tasks_waits_for_a_job(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task cancel 1 --reason "the job was withdrawn"', actor=story.agent)
    story.expect_success('actor make user "Ada"')
    expect_reason(story, worker, "a job")
    with server_story(story) as server:
        expect_browser(server, "workerWait.browser.mjs", [str(worker.id), "a job"])
