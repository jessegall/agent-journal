import json
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_the_inspector_reads_live_spots_wait_order_start_times_and_recent_output(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start inspector-worker claude worker --environment main"), ActorType.AGENT)
    first = start_process(story, "make package", category=CommandCategory.BUILD, is_queued=True)
    story.advance(timedelta(seconds=5))
    second = start_process(story, "make checks", category=CommandCategory.CHECK, is_queued=True)
    third = start_process(story, "make site", category=CommandCategory.BUILD, is_queued=True)
    queue = json.loads(story.run("queue inspect --environment-id 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["used_slots"] == 1, queue["waiting_count"] == 2,
                      [row["id"] for row in queue["waiting"]] == [second.id, third.id],
                      queue["running"][0]["started_at"] is not None,
                      queue["running"][0]["uses_slot"], queue["waiting"][0]["started_at"] is None,
                      queue["running"][0]["worker_id"] == story.agent.id)
    story.advance(timedelta(seconds=7))
    end_run(story, first, "package built\n")
    queue = json.loads(story.run("queue inspect --environment-id 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["running"][0]["id"] == second.id,
                      queue["recent"][0]["id"] == first.id,
                      not queue["recent"][0]["uses_slot"],
                      queue["running"][0]["started_at"] > queue["running"][0]["created_at"])
    story.expect_text(f"output peek {first.id} --all", "package built", actor=story.user)


def test_the_inspector_reads_main_agent_spots_and_the_queue_halt_reason(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.processes.main-runs-take-slots on --environment main", actor=story.user)
    main = start_process(story, "make main", category=CommandCategory.BUILD)
    story.expect_success('queue halt "Machine maintenance"', actor=story.user)
    queue = json.loads(story.run("queue inspect --environment-id 1 --json", actor=story.user).output_text)
    story.expect_rows(queue["count_main_runs"], queue["used_slots"] == 1,
                      queue["running"][0]["id"] == main.id, queue["running"][0]["uses_slot"],
                      queue["halted"], queue["halt_reason"] == "Machine maintenance")
    story.expect_success("queue resume", actor=story.user)
    queue = json.loads(story.run("queue inspect --environment-id 1 --json", actor=story.user).output_text)
    story.expect_rows(not queue["halted"], queue["halt_reason"] == "")
