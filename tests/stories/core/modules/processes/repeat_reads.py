from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.drivers.models.countdown import Countdown
from core.modules.processes.commands.read_output.support.repeat_reads import RUNNING_OUTPUT_READS
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

LONG_OUTPUT = "a line\n" * 400
REPEAT_REFUSAL = "already and it is still in your context"
POLL_REFUSAL = "is still running: stop polling it"
COMPACTION = HookSamples.sample("compact")


@pytest.fixture
def ended_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    end_run(story, process, LONG_OUTPUT)
    story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
    return story, process


def test_the_third_read_in_a_row_of_a_running_output_is_refused_and_another_output_resets_the_count(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first, second = moved_run(story, "make test", category=CommandCategory.TEST_RUN), moved_run(story, "make build", category=CommandCategory.TEST_RUN)
    for _ in range(2):
        story.expect_success(f"output read {first.id} --summary", actor=story.agent)
    story.expect_success(f"output read {second.id} --summary", actor=story.agent)
    story.expect_success(f"output read {first.id} --summary", actor=story.agent)
    story.expect_success(f"output read {first.id} --summary", actor=story.agent)
    story.expect_refusal(f"output read {first.id} --summary", POLL_REFUSAL, actor=story.agent)
    end_run(story, first, LONG_OUTPUT)
    story.expect_success(f"output read {first.id} --summary", actor=story.agent)


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


def kept_reads(story):
    return story.container.get(Queries).query(Countdown).filter(actor_id=story.agent.id, key=RUNNING_OUTPUT_READS.key).first()


def test_a_run_still_going_is_read_again_as_it_grows_and_each_read_is_counted_in_a_row_that_outlives_the_command_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build", category=CommandCategory.BUILD)
    for _ in range(2):
        story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
    story.expect_rows(kept_reads(story).subject == str(process.id), kept_reads(story).used_count == 2)
    end_run(story, process, LONG_OUTPUT)
    story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
    story.expect_rows(kept_reads(story) is None)


def test_a_compaction_clears_what_was_read(ended_run):
    story, process = ended_run
    story.advance(timedelta(seconds=1))
    story.hook("s-1", COMPACTION)
    story.advance(timedelta(seconds=1))
    story.expect_success(f"output read {process.id} --tail 3", actor=story.agent)
