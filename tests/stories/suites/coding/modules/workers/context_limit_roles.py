from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_HARD_TOKENS
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.modules.workers.context_limit import HARD, LimitEnabled, set_value, typing_recorded

TOKENS_OVER_BOTH_LIMITS = 900_000
EDIT = HookSamples.edit("src/cart.py")


class HardLimitWithHelper(StoryFixture):
    """The context limit and its second limit are on, and a helper runs under the main agent."""

    parent = LimitEnabled

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)
        story.expect_success(f"agent start helper-session claude helper --parent {story.agent.id} --environment main")


def report_tokens_exceeding_limits(story, session: str) -> None:
    save_status_file(story, session, {"context_window": {"total_input_tokens": TOKENS_OVER_BOTH_LIMITS}})


def test_a_helper_past_both_context_limits_is_not_compacted_at_its_stop_and_its_tools_go_on(new_story):
    story, session = typing_recorded(new_story(fixture=HardLimitWithHelper)), "helper-session"
    report_tokens_exceeding_limits(story, session)
    reply = story.hook(session, EDIT)
    story.hook(session, HookSamples.stop())
    story.expect_rows(story.typing.typed == [], "context passed" not in reply.refusal, detail=f"{story.typing.typed} {reply.refusal}")
