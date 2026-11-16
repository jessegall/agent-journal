import json

from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHELL_WINDOW = "viewer.shell"
COMPACTED_TEXT = "Conversation compacted"


def test_c2_c3_g4_i1_a_requested_compaction_whose_start_and_end_are_recorded_twice_is_one_row_and_one_line_in_the_chat(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    has_context(story, LIMIT_TOKENS)
    story.hook(SESSION, HookSamples.stop())
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    started = compactions(story)
    story.expect_rows(len(started) == 1, started[0].state is CompactionState.STARTED, started[0].reason is CompactionReason.STOP_LIMIT, detail=str(started))
    story.hook(SESSION, COMPACTION_START)
    story.hook(SESSION, COMPACTION_START)
    story.run_listeners()
    ended = compactions(story)
    marks = story.run("chat-mark list --json", actor=story.user).output_text
    story.expect_rows(len(ended) == 1, ended[0].state is CompactionState.ENDED, ended[0].started_at is not None, marks.count(COMPACTED_TEXT) == 1, detail=f"{ended} {marks}")


def test_i2_i4_a_person_sees_the_open_request_of_an_agent_and_its_inspector_names_who_asked_and_at_what_size(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    has_context(story, LIMIT_TOKENS)
    stops(story)
    number = str(agent_number(story, story.agent.id))
    with viewer_client(story) as person:
        usage = person.value(SHELL_WINDOW, ["usage", "show", "--json"])
        inspector = person.value(SHELL_WINDOW, ["usage", "inspector", number, "--json"])
    change = next(row["context_change"] for row in usage["agents"] if row["id"] == story.agent.id)
    shown = inspector["compaction"]
    story.expect_rows(change["is_open"], change["change"] == "compact", shown["reason"] == "stop_limit", shown["state"] == "requested", shown["request_tokens"] == LIMIT_TOKENS,
                      detail=json.dumps([change, shown]))
