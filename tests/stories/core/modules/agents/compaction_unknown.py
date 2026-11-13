import json

from tests.stories.suites.coding.modules.workers.compaction_never_twice import AutoCompacted, STATUS_FILE_AGE, modified_at_story_time, age_context_past_compaction
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, has_context, typing_recorded
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHELL_WINDOW = "viewer.shell"
TOKENS_AFTER_COMPACTION = 40_000


def shown_context(person, story) -> dict:
    usage = person.value(SHELL_WINDOW, ["usage", "show", "--json"])
    return next(row for row in usage["agents"] if row["id"] == story.agent.id)


def test_i5_the_viewer_shows_the_context_as_unknown_after_a_compaction_until_the_program_reports_a_new_size(new_story):
    story = typing_recorded(new_story(fixture=AutoCompacted))
    age_context_past_compaction(story, LIMIT_TOKENS)
    with viewer_client(story) as person:
        stale = shown_context(person, story)
        story.advance(STATUS_FILE_AGE)
        has_context(story, TOKENS_AFTER_COMPACTION)
        modified_at_story_time(story)
        current = shown_context(person, story)
    story.expect_rows(stale["context_unknown"], stale["context_percent"] is None, stale["context_tokens"] is None, current["context_unknown"] is False,
                      detail=json.dumps([stale, current], default=str))
