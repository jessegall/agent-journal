from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from tests.stories.suites.coding.modules.workers.compaction_never_twice import modified_at_story_time
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded

TOKENS_AFTER_COMPACTION = LIMIT_TOKENS // 4
STATUS_FILE_DELAY = timedelta(seconds=30)


def compactions(story) -> list[ContextCompaction]:
    return list(story.container.get(Queries).query(ContextCompaction).all_rows())


def test_a_compaction_asked_at_a_stop_is_one_row_from_its_request_to_the_first_size_read_after_it_and_nothing_is_typed_again(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    has_context(story, LIMIT_TOKENS)
    stops(story)
    requested = compactions(story)
    story.expect_rows(len(requested) == 1, requested[0].reason is CompactionReason.STOP_LIMIT, requested[0].state is CompactionState.REQUESTED, requested[0].request_tokens == LIMIT_TOKENS,
                      requested[0].line == COMPACT_LINE, requested[0].created_at is not None, detail=str(requested))
    with pytest.raises(Refusal, match="a compact is requested since"):
        story.container.get(Bus).run(CompactAgentContext(story.agent.id), story.agent)
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    started = compactions(story)
    story.expect_rows(len(started) == 1, started[0].state is CompactionState.STARTED, started[0].started_at is not None, detail=str(started))
    story.hook(SESSION, COMPACTION_START)
    story.run_listeners()
    ended = compactions(story)
    story.expect_rows(len(ended) == 1, ended[0].state is CompactionState.ENDED, ended[0].ended_at is not None, ended[0].tokens_after is None, detail=str(ended))
    story.advance(STATUS_FILE_DELAY)
    has_context(story, TOKENS_AFTER_COMPACTION)
    modified_at_story_time(story)
    story.hook(SESSION, HookSamples.sample("post_tool_use"))
    measured = compactions(story)
    story.expect_rows(len(measured) == 1, measured[0].state is CompactionState.MEASURED, measured[0].tokens_after == TOKENS_AFTER_COMPACTION, detail=str(measured))
    stops(story)
    story.expect_rows(story.typing.typed.count(COMPACT_LINE) == 1, len(compactions(story)) == 1, detail=str(story.typing.typed))
