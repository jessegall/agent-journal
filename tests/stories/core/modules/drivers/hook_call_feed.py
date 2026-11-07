from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_the_feed_brings_an_agents_hook_calls_with_only_the_fields_the_window_draws(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop())
    answer = story.run(f"hook-call feed --session-agent-id {story.agent.id} --json", actor=story.user)
    answer.expect_text('"hook": "stop"')
    answer.expect_text('"refusal"')
    answer.expect_no_text('"lines":')
    answer.expect_no_text('"updated_input"')
    answer.expect_no_text('"metadata"')


def test_the_feed_pages_by_id(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop().with_fields(firing="f-1"))
    story.hook("s-1", HookSamples.stop().with_fields(firing="f-2"))
    newest = story.run(f"hook-call feed --session-agent-id {story.agent.id} --limit 1 --json", actor=story.user)
    newest.expect_text('"id": 3')
    newest.expect_no_text('"id": 2')
    older = story.run(f"hook-call feed --session-agent-id {story.agent.id} --before-id 3 --json", actor=story.user)
    older.expect_text('"id": 2')
    older.expect_no_text('"id": 3')


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
