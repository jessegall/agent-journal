from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from suites.coding.support.context_line import CONTEXT_LINE
from tests.stories.core.support.coding_fixtures import HelperUnderBuilder, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})


def lines_at(story: Story, session: str, sample) -> list[str]:
    return list(story.hook(session, sample).lines)


def test_a_helper_is_told_at_its_start_and_after_a_compaction_that_a_full_context_loses_nothing(new_story):
    story = new_story(fixture=HelperUnderBuilder)
    assert CONTEXT_LINE in lines_at(story, "sub-1", HookSamples.session_start().with_fields(session="sub-1"))
    assert CONTEXT_LINE in lines_at(story, "sub-1", COMPACTION.with_fields(session="sub-1"))


def test_a_worker_is_told_at_its_start_and_after_a_compaction_that_a_full_context_loses_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    session = worker_session(story, dispatched_worker(story))
    assert CONTEXT_LINE in lines_at(story, session, HookSamples.session_start().with_fields(session=session))
    assert CONTEXT_LINE in lines_at(story, session, COMPACTION.with_fields(session=session))
