from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, moved_run_of
from tests.stories.core.support.coding_fixtures import BuilderHelper, BuilderStarted

LONG_OUTPUT = "a line\n" * 400
REPEAT_REFUSAL = "already and it is still in your context"
POLL_REFUSAL = "is still running and you read it already: stop polling it"
COMPACTION = HookSamples.sample("compact")


@pytest.fixture
def ended_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    end_run(story, process, LONG_OUTPUT)
    story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
    return story, process


def test_a_running_output_the_agent_read_once_is_refused_in_every_form_until_it_ends(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.expect_success(f"output read {process.id} --summary", actor=story.agent)
    for form in ("--summary", "--tail 3", "--lines 1-3", "--all"):
        story.expect_refusal(f"output read {process.id} {form}", f"{POLL_REFUSAL}: set a monitor with journal output monitor {process.id}", actor=story.agent)
        story.expect_no_text(f"output read {process.id} {form}", "go idle", "a helper", actor=story.agent)
    end_run(story, process, LONG_OUTPUT)
    story.expect_success(f"output read {process.id} --summary", actor=story.agent)


def test_a_helper_and_a_worker_are_told_to_go_idle_and_not_what_a_main_agent_does(new_story):
    story = install_runner(new_story(fixture=BuilderHelper))
    worker = Actor(story.new_row_id(f"agent start sub-2 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    for agent in (story.helper, worker):
        process = moved_run_of(story, agent, "make test", category=CommandCategory.TEST_RUN)
        story.expect_success(f"output read {process.id} --summary", actor=agent)
        story.expect_refusal(f"output read {process.id} --summary", "go idle: the journal wakes you when it ends", actor=agent)
        story.expect_no_text(f"output read {process.id} --summary", "a main agent", "monitor", actor=agent)


def test_other_commands_between_reads_do_not_lift_the_refusal_of_a_running_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process, other = moved_run(story, "make test", category=CommandCategory.TEST_RUN), moved_run(story, "make build", category=CommandCategory.TEST_RUN)
    story.expect_success(f"output read {process.id} --summary", actor=story.agent)
    story.expect_success(f"output read {other.id} --summary", actor=story.agent)
    story.expect_success("task list", actor=story.agent)
    story.expect_refusal(f"output read {process.id} --summary", POLL_REFUSAL, actor=story.agent)
    story.expect_refusal(f"output read {other.id} --summary", POLL_REFUSAL, actor=story.agent)


def test_a_second_read_of_an_ended_run_the_same_way_is_refused_and_again_reads_it(ended_run):
    story, process = ended_run
    story.expect_refusal(f"output read {process.id} --tail 3", REPEAT_REFUSAL, actor=story.agent)
    story.expect_success(f"output read {process.id} --tail 3 --again", actor=story.agent)
    story.expect_success(f"output read {process.id} --lines 1-3", actor=story.agent)


def test_a_read_while_it_runs_does_not_count_as_a_read_of_the_result(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make check", category=CommandCategory.TEST_RUN)
    story.expect_success(f"output read {process.id} --lines 1-3", actor=story.agent)
    end_run(story, process, LONG_OUTPUT)
    story.expect_success(f"output read {process.id} --lines 1-3", actor=story.agent)
    story.expect_refusal(f"output read {process.id} --lines 1-3", REPEAT_REFUSAL, actor=story.agent)


def test_a_person_reads_an_output_as_often_as_they_like(ended_run):
    story, process = ended_run
    for _ in range(2):
        story.expect_success(f"output read {process.id} --tail 3")


def test_a_compaction_clears_what_was_read(ended_run):
    story, process = ended_run
    story.advance(timedelta(seconds=1))
    story.hook("s-1", COMPACTION)
    story.advance(timedelta(seconds=1))
    story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
