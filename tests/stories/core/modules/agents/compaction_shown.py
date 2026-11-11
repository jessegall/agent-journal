import json

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.compaction_never_twice import compacted
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHELL_WINDOW = "viewer.shell"
COMPACTED_TEXT = "Conversation compacted"


def test_i1_two_compaction_starts_of_one_compaction_draw_one_line_in_the_chat(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "auto"}))
    compacted(story, "auto")
    marks = story.run("chat-mark list --json", actor=story.user).output_text
    story.expect_rows(marks.count(COMPACTED_TEXT) == 1, detail=marks)


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
