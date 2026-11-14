from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.read_limit import limit_reads


def test_the_feed_gives_a_hundred_calls_in_one_page_and_the_older_ones_in_the_next(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    for number in range(105):
        story.hook("s-1", HookSamples.stop().with_fields(firing=f"f-{number}"))
    newest = story.run(f"hook-call feed --session-agent-id {story.agent.id} --limit 100 --json", actor=story.user)
    newest.expect_text('"id": 106,')
    newest.expect_text('"id": 7,')
    newest.expect_no_text('"id": 6,')
    older = story.run(f"hook-call feed --session-agent-id {story.agent.id} --limit 100 --before-id 7 --json", actor=story.user)
    older.expect_text('"id": 6,')
    older.expect_text('"id": 1,')
    older.expect_no_text('"id": 7,')


def test_a_feed_of_two_hundred_calls_reads_them_fifty_at_a_time_under_the_read_limit(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    for number in range(105):
        story.hook("s-1", HookSamples.prompt(f"go on {number}"))
    limit_reads(story)
    feed = story.run(f"hook-call feed --session-agent-id {story.agent.id} --limit 200 --json", actor=story.user)
    feed.expect_text('"id": 106,')
    feed.expect_text('"id": 1,')
