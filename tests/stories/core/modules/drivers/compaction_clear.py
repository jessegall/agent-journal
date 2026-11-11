import pytest

from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.models.enums.context_change import ContextChange
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION
from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.suites.coding.modules.workers.compaction_never_twice import set_context_older_than_compaction
from tests.stories.suites.coding.modules.workers.context_limit import CLEAR_START, LIMIT_TOKENS, SESSION, LimitEnabled, has_context, set_value, stops, typing_recorded

SMALL_CONTEXT = 20_000
CLEAR_LINE = "/clear"
WAKE_WAIT = timedelta(seconds=40)
EDIT = HookSamples.edit("src/cart.py")


class LimitClears(StoryFixture):
    """The context limit is on and clears the context instead of compacting it."""

    parent = LimitEnabled

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_ACTION, ContextChange.CLEAR.value)


@pytest.fixture
def clearing(new_story):
    return typing_recorded(new_story(fixture=LimitClears))


def rows(story) -> list[tuple[ContextChange, CompactionState]]:
    return [(compaction.change, compaction.state) for compaction in compactions(story)]


def test_c5_a_clear_at_a_stop_is_one_row_that_ends_at_its_session_start_wakes_the_agent_once_and_an_older_size_clears_nothing_again(clearing):
    has_context(clearing, LIMIT_TOKENS)
    stops(clearing)
    requested = rows(clearing)
    clearing.hook(SESSION, CLEAR_START)
    clearing.run_listeners()
    set_context_older_than_compaction(clearing, LIMIT_TOKENS)
    stops(clearing)
    clearing.advance(WAKE_WAIT)
    clearing.tick(SESSION)
    lines = clearing.typing.typed
    clearing.expect_rows(requested == [(ContextChange.CLEAR, CompactionState.REQUESTED)], rows(clearing) == [(ContextChange.CLEAR, CompactionState.ENDED)],
                         lines[0] == CLEAR_LINE, len(lines) == 2 and "compacted" in lines[1], detail=f"{requested} {rows(clearing)} {lines}")


def test_the_first_size_read_after_a_clear_measures_its_row(clearing):
    clearing.hook(SESSION, CLEAR_START)
    clearing.run_listeners()
    has_context(clearing, SMALL_CONTEXT)
    clearing.hook(SESSION, EDIT)
    clearing.expect_rows(rows(clearing) == [(ContextChange.CLEAR, CompactionState.MEASURED)], compactions(clearing)[0].tokens_after == SMALL_CONTEXT, detail=str(compactions(clearing)))
