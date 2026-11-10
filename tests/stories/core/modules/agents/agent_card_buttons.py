from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.agents.agent_cards_numbers import WINDOW, card
from tests.stories.core.modules.agents.agent_driver import CODEX_MODEL, DRIVER
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, StartedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

RETIREMENT_REASON = "Its reading is done"


def test_a_person_pauses_stops_and_retires_an_agent_from_its_card_by_its_number(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"stopped\n", request_count=4)
    with viewer_client(story) as person:
        person.value(WINDOW, ["agent", "pause", str(helper.number)])
        paused = helper_agent(story)
        person.value(WINDOW, ["agent", "stop", str(helper.number)])
        stopped = helper_agent(story)
        person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON])
    launcher.server.close()
    retired = helper_agent(story)
    story.expect_rows(paused.paused_at is not None, stopped.ended_at is not None, retired.retired_at is not None, retired.retirement_reason == RETIREMENT_REASON, retired.id == helper.id,
                      detail=str(retired))


def test_the_card_of_an_agent_whose_session_was_replaced_is_the_same_card_and_says_why_the_old_session_ended(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    with viewer_client(story) as person:
        first_card = card(person, helper.number)
        person.value(WINDOW, DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL).split())
        replaced_card = card(person, helper.number)
    story.expect_rows(replaced_card["id"] == first_card["id"] == helper.id, replaced_card["number"] == first_card["number"], replaced_card["session"] != first_card["session"],
                      replaced_card["replaced_session_end_reason"] == "driver_changed", first_card["replaced_session_end_reason"] is None, detail=str(replaced_card))
