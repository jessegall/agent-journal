from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from tests.stories.core.modules.agents.agent_cards_numbers import WINDOW
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

RETIREMENT_REASON = "Its reading is done"


def card_facts(person, helper) -> dict:
    return person.value(WINDOW, ["usage", "agents", "--closed", "--agent", str(helper.number), "--json"])["rows"][0]


def test_a_person_pauses_stops_ends_the_open_job_and_retires_an_agent_from_its_card_by_its_number(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=b"stopped\n", request_count=5)
    with viewer_client(story) as person:
        person.value(WINDOW, ["agent", "pause", str(helper.number)])
        paused = helper_agent(story)
        person.value(WINDOW, ["helper", "stop", str(helper.number)])
        story.run_listeners()
        job_open = card_facts(person, helper)["helper_job_open"] == (story.container.get(HelperJobRows).open_job(helper.id) is not None)
        person.value(WINDOW, ["helper", "stop", str(helper.number)])
        stopped = helper_agent(story)
        job_ended = card_facts(person, helper)["helper_job_open"] is False
        person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON])
    launcher.server.close()
    retired = helper_agent(story)
    story.expect_rows(paused.paused_at is not None, job_open, job_ended, stopped.ended_at is not None, retired.retired_at is not None, retired.retirement_reason == RETIREMENT_REASON, retired.id == helper.id,
                      detail=f"the card and the rows agree on the open job {job_open}, job ended {job_ended}, {retired}")
