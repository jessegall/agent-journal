from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES

def test_a_hook_sent_twice_under_one_event_id_gets_its_stored_answer_and_asks_no_rule(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    stop = HookSamples.stop().with_fields(event_id="f-9")
    first = story.hook("s-1", stop)
    second = story.hook("s-1", stop)
    story.expect_rows(first == second)
    story.expect_text(f"hook-call list --agent {story.agent.id}", f"2  {story.agent.id}  stop")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", f"3  {story.agent.id}  stop")
