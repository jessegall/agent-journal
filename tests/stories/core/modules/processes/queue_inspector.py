import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.agent_labels import agent_number
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT


def test_the_inspector_reads_live_spots_wait_order_start_times_and_recent_output(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=story.user)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start inspector-worker claude worker --environment main"), ActorType.AGENT)
    first = start_process(story, "make package", category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=5))
    second = start_process(story, "make checks", category=CommandCategory.TEST_RUN)
    third = start_process(story, "make site", category=CommandCategory.BUILD)
    queue = json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["used_slots"] == 1, queue["waiting_count"] == 2,
                      [row["id"] for row in queue["waiting"]] == [second.id, third.id],
                      queue["running"][0]["started_at"] is not None,
                      queue["running"][0]["uses_slot"], queue["waiting"][0]["started_at"] is None,
                      queue["running"][0]["owner_agent_id"] == story.agent.id)
    story.advance(timedelta(seconds=7))
    end_run(story, first, "package built\n")
    queue = json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["running"][0]["id"] == second.id,
                      queue["recent"][0]["id"] == first.id,
                      not queue["recent"][0]["uses_slot"],
                      queue["running"][0]["started_at"] > queue["running"][0]["created_at"])
    story.expect_text(f"output peek {first.id} --all", "package built", actor=story.user)


def test_the_finished_list_reads_as_many_as_asked_and_counts_them_all(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    runs = [start_process(story, f"make step-{number}", category=CommandCategory.BUILD) for number in range(3)]
    for run in runs:
        end_run(story, run, "done\n")
    queue = json.loads(story.run("queue list --environment 1 --recent 2 --json", actor=story.user).output_text)
    story.expect_rows(len(queue["recent"]) == 2, queue["recent_total"] == 3)


def test_the_inspector_reads_main_agent_spots_and_the_queue_halt_reason(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.processes.main-runs-take-slots on --environment main", actor=story.user)
    main = start_process(story, "make main", category=CommandCategory.BUILD)
    story.expect_success('queue halt "Machine maintenance"', actor=story.user)
    queue = json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["count_main_runs"], queue["used_slots"] == 1,
                      queue["running"][0]["id"] == main.id, queue["running"][0]["uses_slot"],
                      queue["halted"], queue["halt_reason"] == "Machine maintenance")
    story.expect_success("queue resume", actor=story.user)
    queue = json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(not queue["halted"], queue["halt_reason"] == "")


def test_the_inspector_explains_a_server_restart(new_story):
    story = new_story(fixture=UserBuilder)
    story.home.restart_mark.write_text("1")
    queue = json.loads(story.run("queue inspect --environment 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["halted"], queue["halt_reason"] == "Server restart")


def test_an_agents_processes_tab_lists_only_that_agents_running_waiting_and_finished_runs(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    worker = story.new_row_id("agent start processes-worker claude worker --environment main")
    other = story.new_row_id("agent start other-worker claude worker --environment main")
    story.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=story.user)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(worker, ActorType.AGENT)
    finished = start_process(story, "make previous", category=CommandCategory.BUILD)
    end_run(story, finished, "done\n")
    running = start_process(story, "make package", category=CommandCategory.BUILD)
    waiting = start_process(story, "make checks", category=CommandCategory.TEST_RUN)
    story.agent = Actor(other, ActorType.AGENT)
    start_process(story, "make site", category=CommandCategory.BUILD)
    queue = json.loads(story.run(f"queue list --environment 1 --agent {agent_number(story, worker)} --json", actor=story.user).output_text)
    story.expect_rows([row["id"] for row in queue["running"]] == [running.id], [row["id"] for row in queue["waiting"]] == [waiting.id],
                      [row["id"] for row in queue["recent"]] == [finished.id], detail=json.dumps(queue)[:400])
