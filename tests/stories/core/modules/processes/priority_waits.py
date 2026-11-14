from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents
from tests.stories.core.modules.processes.run_queue import queued

LANES = "queue-class lanes"


def test_the_lanes_name_the_longest_and_average_wait_of_each_priority_over_the_last_hour(new_story):
    story = new_story(fixture=QueueAgents)
    first, second, third = (queued(story, f"make part-{number}", CommandCategory.BUILD) for number in range(3))
    story.advance(timedelta(seconds=40))
    end_run(story, first, "ok\n")
    story.expect_text(LANES, "waits over the last hour:", "agent: 3 runs started, longest wait 40 s, average 13 s", actor=story.user)


def test_a_run_started_more_than_an_hour_ago_is_not_counted(new_story):
    story = new_story(fixture=QueueAgents)
    queued(story, "make old", CommandCategory.BUILD)
    story.advance(timedelta(hours=2))
    story.expect_text(LANES, "waits over the last hour: no run started", actor=story.user)
