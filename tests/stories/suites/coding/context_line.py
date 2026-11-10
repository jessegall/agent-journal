from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from suites.coding.support.context_line import CONTEXT_LINE
from tests.stories.core.support.coding_fixtures import BuilderHelper, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_value

COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})


def lines_at(story: Story, session: str, sample) -> list[str]:
    return list(story.hook(session, sample).lines)


def test_a_helper_is_told_at_its_start_and_after_a_compaction_that_a_full_context_loses_nothing(new_story):
    story = new_story(fixture=BuilderHelper)
    expect_value(CONTEXT_LINE in lines_at(story, "sub-1", HookSamples.session_start().with_fields(session="sub-1")), True)
    expect_value(CONTEXT_LINE in lines_at(story, "sub-1", COMPACTION.with_fields(session="sub-1")), True)


def test_a_worker_is_told_at_its_start_and_after_a_compaction_that_a_full_context_loses_nothing(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    session = worker_session(story, dispatched_worker(story))
    expect_value(CONTEXT_LINE in lines_at(story, session, HookSamples.session_start().with_fields(session=session)), True)
    expect_value(CONTEXT_LINE in lines_at(story, session, COMPACTION.with_fields(session=session)), True)
