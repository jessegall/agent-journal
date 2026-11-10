import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_driver import CODEX_MODEL, DRIVER
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

WINDOW = "agents.agents"
MEMORY_TEXT = "The cart rounds each line before it adds them"
RETIREMENT_REASON = "Its reading is done"


@pytest.fixture
def ended(new_story):
    return new_story(fixture=EndedHelper)


def cards(person, *flags: str, environment: str = "main") -> dict:
    """The page of agent cards a person reads in the agents window of one environment, main agent included."""
    return person.server.viewer_line_value(person.cookie, {"window": WINDOW, "environment": environment, "line": ["agent", "cards", "--include-main", *flags, "--json"]})


def card(person, number: int) -> dict:
    return next(row for row in cards(person, "--show", "all")["rows"] if row["number"] == number)


def viewer_retirement(person, helper) -> None:
    person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON, "--environment", "main"])


def test_the_agents_list_gives_each_agent_its_number_role_driver_state_sessions_and_memories(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        main_card, helper_card = card(person, 1), card(person, helper.number)
    ended.expect_rows(main_card["role"] == "main", main_card["state"] == "running", main_card["session_count"] == 1, detail=str(main_card))
    ended.expect_rows(helper_card["role"] == "helper", (helper_card["program"], helper_card["program_model"]) == (helper.program, helper.program_model),
                      helper_card["state"] == "idle", helper_card["session_count"] == 1, helper_card["memory_count"] == 1, detail=str(helper_card))


def test_the_card_of_an_agent_moved_to_codex_carries_its_new_driver_and_two_sessions_which_its_history_lists(ended):
    helper = helper_agent(ended)
    with viewer_client(ended) as person:
        person.value(WINDOW, DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL).split())
        moved_card = card(person, helper.number)
        history = person.value(WINDOW, ["agent", "sessions", str(helper.number), "--json"])
    ended.expect_rows((moved_card["program"], moved_card["program_model"]) == ("codex", CODEX_MODEL), moved_card["session_count"] == 2,
                      [row["program"] for row in history["rows"]] == ["codex", helper.program], detail=str(moved_card))


def test_a_person_who_switches_environment_reads_the_agents_of_that_environment_with_their_own_numbers(ended):
    ended.expect_success("environment make staging /work/staging")
    ended.expect_success("agent start s-20 claude main --environment staging")
    ended.expect_success("agent start s-21 claude worker --environment staging")
    with viewer_client(ended) as person:
        staging, main = cards(person, "--show", "all", environment="staging")["rows"], cards(person, "--show", "all")["rows"]
    ended.expect_rows(sorted((row["number"], row["role"]) for row in staging) == [(1, "main"), (2, "worker")], [row["role"] for row in main if row["number"] == 2] == ["helper"],
                      detail=f"{staging} / {main}")


def test_a_person_in_a_new_environment_reads_an_empty_list_with_no_agent_of_another_environment(ended):
    ended.expect_success("environment make staging /work/staging")
    with viewer_client(ended) as person:
        staging = cards(person, "--show", "all", environment="staging")
    ended.expect_rows(staging["rows"] == [], staging["total"] == 0, detail=str(staging))


def test_the_list_pages_and_leaves_retired_agents_out_until_the_person_asks_for_them(ended):
    helper = helper_agent(ended)
    for session in ("s-31", "s-32", "s-33"):
        ended.expect_success(f"agent end {ended.new_row_id(f'agent start {session} claude worker --environment main')}", actor=ended.user)
    with viewer_client(ended) as person:
        viewer_retirement(person, helper)
        first_page, second_page = cards(person, "--show", "idle", "--limit", "2"), cards(person, "--show", "idle", "--limit", "2", "--page", "2")
        retired = cards(person, "--show", "retired")["rows"]
    listed = [row["number"] for row in (*first_page["rows"], *second_page["rows"])]
    ended.expect_rows(len(first_page["rows"]) == 2, first_page["total"] == 3, len(listed) == len(set(listed)) == 3, helper.number not in listed, detail=str(listed))
    ended.expect_rows([row["number"] for row in retired] == [helper.number], detail=str(retired))


def test_a_person_who_opens_a_retired_agent_reads_its_reason_who_retired_it_when_and_its_memory_count(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        viewer_retirement(person, helper)
        retired_card = card(person, helper.number)
    retired = helper_agent(ended)
    ended.expect_rows(retired_card["state"] == "retired", retired_card["retirement_reason"] == RETIREMENT_REASON, retired_card["retired_at"] == retired.retired_at.text,
                      retired_card["retiring_actor_name"] == "Ada", retired_card["memory_count"] == 1, detail=str(retired_card))
