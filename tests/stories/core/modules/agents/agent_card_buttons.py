from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.agents.agent_cards_numbers import WINDOW
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

RETIREMENT_REASON = "Its reading is done"


def test_a_person_pauses_stops_and_retires_an_agent_from_its_card_by_its_number(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"stopped\n", request_count=5)
    with viewer_client(story) as person:
        person.value(WINDOW, ["agent", "pause", str(helper.number)])
        paused = helper_agent(story)
        person.value(WINDOW, ["helper", "stop", str(helper.number)])
        story.run_listeners()
        person.value(WINDOW, ["helper", "stop", str(helper.number)])
        stopped = helper_agent(story)
        person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON])
    launcher.server.close()
    retired = helper_agent(story)
    story.expect_rows(paused.paused_at is not None, stopped.ended_at is not None, retired.retired_at is not None, retired.retirement_reason == RETIREMENT_REASON, retired.id == helper.id,
                      detail=str(retired))
