from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import LIMIT, with_reported_usage
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment
from tests.stories.suites.coding.modules.workers.usage_lockdown_held_starts import person, worker_count

REFUSAL = "no program can take this worker: Claude is at your usage limit until"


def test_a_worker_dispatch_is_refused_with_the_reason_by_model_by_program_named_and_with_neither_and_no_worker_is_made(new_story):
    story = with_reported_usage(new_story(fixture=MergerOffOrchestrator))
    repository_environment(story)
    story.expect_success(LIMIT, actor=person(story))
    report(story, 55)
    story.expect_refusal(DISPATCH, REFUSAL, actor=story.agent)
    story.expect_refusal(DISPATCH.replace("--model sonnet", "--program claude"), REFUSAL, actor=story.agent)
    story.expect_refusal(DISPATCH.replace("--model sonnet ", ""), REFUSAL, actor=story.agent)
    story.expect_rows(worker_count(story) == 0)
