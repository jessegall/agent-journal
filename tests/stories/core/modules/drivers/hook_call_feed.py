from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_the_feed_brings_an_agents_hook_calls_with_only_the_fields_the_window_draws(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop())
    answer = story.run(f"hook-call feed --agent-id {story.agent.id} --json", actor=story.user).output_text
    assert '"hook": "stop"' in answer and '"refusal"' in answer
    assert '"lines"' not in answer and '"updated_input"' not in answer and '"metadata"' not in answer


def test_the_feed_pages_by_id(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop().with_fields(firing="f-1"))
    story.hook("s-1", HookSamples.stop().with_fields(firing="f-2"))
    newest = story.run(f"hook-call feed --agent-id {story.agent.id} --limit 1 --json", actor=story.user).output_text
    assert '"id": 3' in newest and '"id": 2' not in newest
    older = story.run(f"hook-call feed --agent-id {story.agent.id} --before-id 3 --json", actor=story.user).output_text
    assert '"id": 2' in older and '"id": 3' not in older
