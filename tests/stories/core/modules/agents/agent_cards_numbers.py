import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_driver import CODEX_MODEL, DRIVER
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

WINDOW = "agents.agents"
MEMORY_TEXT = "The cart rounds each line before it adds them"
RETIREMENT_REASON = "Its reading is done"
PLACEHOLDER_STATE = "no session yet"


@pytest.fixture
def ended(new_story):
    return new_story(fixture=EndedHelper)


def cards(person, *flags: str, environment: str = "main") -> list[dict]:
    """The agent cards a person reads in the agents window of one environment."""
    return person.server.viewer_line_value(person.cookie, {"window": WINDOW, "environment": environment, "line": ["usage", "agents", *flags, "--json"]})["rows"]


def retire_through_viewer(story, person, helper) -> None:
    person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON, "--environment", "main"])


def test_the_agents_list_gives_each_agent_its_number_role_driver_state_sessions_and_memories_and_names_agent_1_the_main_agent(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        rows = {row["number"]: row for row in cards(person, "--closed")}
    main_card, helper_card = rows[1], rows[helper.number]
    ended.expect_rows(main_card["label"] == "Main agent", main_card["role"] == "main", main_card["state"] == "running", detail=str(main_card))
    ended.expect_rows(helper_card["label"] == f"Helper {helper.number}", (helper_card["program"], helper_card["program_model"]) == (helper.program, helper.program_model),
                      helper_card["state"] == "idle", helper_card["session_count"] == 1, helper_card["memory_count"] == 1, detail=str(helper_card))


def test_the_card_of_an_agent_moved_to_codex_names_its_driver_and_leads_to_its_session_history(ended):
    helper = helper_agent(ended)
    with viewer_client(ended) as person:
        person.value(WINDOW, DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL).split())
        card = cards(person, "--closed", "--agent", str(helper.number))[0]
        history = person.value(WINDOW, card["sessions_command"])
    ended.expect_rows(card["driver"] == f"Codex {CODEX_MODEL}", card["session_count"] == 2, card["sessions_command"] == ["agent", "sessions", str(helper.number), "--json"],
                      [row["program"] for row in history["rows"]] == ["codex", helper.program], detail=str(card))


def test_a_person_who_switches_environment_reads_the_agents_of_that_environment_with_their_own_numbers(ended):
    ended.expect_success("environment make staging /work/staging")
    ended.expect_success("agent start s-20 claude main --environment staging")
    ended.expect_success("agent start s-21 claude worker --environment staging")
    with viewer_client(ended) as person:
        staging, main = cards(person, environment="staging"), cards(person, "--closed")
    ended.expect_rows(sorted((row["number"], row["role"]) for row in staging) == [(1, "main"), (2, "worker")], [row["role"] for row in main if row["number"] == 2] == ["helper"],
                      detail=f"{staging} / {main}")


def test_a_person_in_a_new_environment_reads_agent_1_with_no_session_yet_and_no_row_behind_it(ended):
    ended.expect_success("environment make staging /work/staging")
    with viewer_client(ended) as person:
        staging = cards(person, environment="staging")
    ended.expect_rows(len(staging) == 1, detail=str(staging))
    ended.expect_rows((staging[0]["number"], staging[0]["id"], staging[0]["state"], staging[0]["label"]) == (1, None, PLACEHOLDER_STATE, "Main agent"), detail=str(staging))


def test_the_list_pages_and_leaves_retired_agents_out_until_the_person_asks_for_them(ended):
    helper = helper_agent(ended)
    for session in ("s-31", "s-32", "s-33"):
        ended.expect_success(f"agent end {ended.new_row_id(f'agent start {session} claude worker --environment main')}", actor=ended.user)
    with viewer_client(ended) as person:
        retire_through_viewer(ended, person, helper)
        first_page = person.value(WINDOW, ["usage", "agents", "--closed", "--limit", "2", "--json"])
        second_page = person.value(WINDOW, ["usage", "agents", "--closed", "--limit", "2", "--page", "2", "--json"])
        with_retired = cards(person, "--closed", "--retired")
    listed = [row["number"] for row in (*first_page["rows"], *second_page["rows"])]
    ended.expect_rows(len(first_page["rows"]) == 2, first_page["more"] is True, len(listed) == len(set(listed)) == 4, helper.number not in listed, second_page["more"] is False, detail=str(listed))
    ended.expect_rows([row["state"] for row in with_retired if row["number"] == helper.number] == ["retired"], detail=str(with_retired))


def test_a_person_who_opens_a_retired_agent_reads_its_reason_who_retired_it_when_and_its_memories(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        retire_through_viewer(ended, person, helper)
        card = cards(person, "--closed", "--retired", "--agent", str(helper.number))[0]
        memories = person.value(WINDOW, card["memories_command"])
    retired = helper_agent(ended)
    ended.expect_rows(card["state"] == "retired", card["retirement_reason"] == RETIREMENT_REASON, card["retired_at"] == retired.retired_at.text, card["retired_by"] == "Ada",
                      MEMORY_TEXT in str(memories), detail=str(card))
