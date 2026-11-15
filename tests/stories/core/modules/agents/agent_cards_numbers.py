import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_driver import CODEX_MODEL, DRIVER
from tests.stories.core.modules.agents.support.numbered_agents import FIRST_STORY_NUMBER
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

WINDOW = "agents.agents"
MEMORY_TEXT = "The cart rounds each line before it adds them"
RETIREMENT_REASON = "Its reading is done"


@pytest.fixture
def ended(new_story):
    return new_story(fixture=EndedHelper)


def cards(person, *flags: str, environment: str = "main") -> dict:
    """The page of agent cards a user reads in the agents window of one environment, main agent included."""
    return person.server.viewer_line_value(person.cookie, {"window": WINDOW, "environment": environment, "line": ["agent", "cards", "--include-main", *flags, "--json"]})


def own_cards(person, *flags: str, environment: str = "main") -> list[dict]:
    matched, page = [], 1
    while rows := cards(person, *flags, "--page", str(page), environment=environment)["rows"]:
        matched += [row for row in rows if row["number"] >= FIRST_STORY_NUMBER]
        page += 1
    return matched


def card(person, number: int) -> dict:
    return next(row for row in own_cards(person, "--show", "all") if row["number"] == number)


def viewer_retirement(person, helper) -> None:
    person.value(WINDOW, ["agent", "retire", str(helper.number), "--reason", RETIREMENT_REASON, "--environment", "main"])


def test_the_agents_list_gives_each_agent_its_number_role_driver_state_sessions_and_memories(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        main_card, helper_card = card(person, 1), card(person, helper.number)
    every_card = json.loads(ended.run("agent cards --include-main --show all --environment main --limit 100 --json", actor=ended.user).output_text)["rows"]
    listed = [row for row in every_card if row["number"] >= FIRST_STORY_NUMBER]
    ended.expect_rows(main_card["role"] == "main", main_card["state"] == "running", main_card["session_count"] == 1, detail=str(main_card))
    ended.expect_rows(helper_card["role"] == "helper", (helper_card["program"], helper_card["program_model"]) == (helper.program, helper.program_model),
                      helper_card["state"] == "idle", helper_card["session_count"] == 1, helper_card["memory_count"] == 1, detail=str(helper_card))
    ended.expect_rows(sorted(row["number"] for row in listed) == [1, helper.number], detail=str(listed))


def test_the_card_of_an_agent_moved_to_codex_is_the_same_card_with_its_new_driver_two_sessions_and_why_the_old_one_ended(ended):
    helper = helper_agent(ended)
    with viewer_client(ended) as person:
        first_card = card(person, helper.number)
        person.value(WINDOW, DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL).split())
        moved_card = card(person, helper.number)
        history = person.value(WINDOW, ["agent", "sessions", str(helper.number), "--json"])
    ended.expect_rows((moved_card["program"], moved_card["program_model"]) == ("codex", CODEX_MODEL), moved_card["session_count"] == 2,
                      [row["program"] for row in history["rows"]] == ["codex", helper.program], detail=str(moved_card))
    command_line_history = json.loads(ended.run(f"agent sessions {helper.number} --environment main --json", actor=ended.user).output_text)["rows"]
    ended.expect_rows([row["end_reason"] for row in command_line_history] == [row["end_reason"] for row in history["rows"]], command_line_history[-1]["end_reason"] == "driver_changed", detail=str(command_line_history))
    ended.expect_text(f"agent show {helper.number} --environment main", "program: codex", f"program_model: {CODEX_MODEL}", actor=ended.user)
    ended.expect_rows(moved_card["id"] == first_card["id"] == helper.id, moved_card["number"] == first_card["number"], moved_card["session"] != first_card["session"],
                      moved_card["replaced_session_end_reason"] == "driver_changed", first_card["replaced_session_end_reason"] is None, detail=str(moved_card))


def test_a_person_who_switches_to_a_new_environment_reads_an_empty_list_and_later_its_agents_with_their_own_numbers(ended):
    ended.expect_success("environment make staging /work/staging")
    with viewer_client(ended) as person:
        new_environment = cards(person, "--show", "all", environment="staging")
    ended.expect_success("agent start s-20 claude main --environment staging")
    ended.expect_success("agent start s-21 claude worker --environment staging")
    with viewer_client(ended) as person:
        staging, main = own_cards(person, "--show", "all", environment="staging"), own_cards(person, "--show", "all")
    ended.expect_rows(sorted((row["number"], row["role"]) for row in staging) == [(1, "main"), (2, "worker")], [row["role"] for row in main if row["number"] == 2] == ["helper"],
                      new_environment["rows"] == [], new_environment["total"] == 0, detail=f"{new_environment} / {staging} / {main}")


def test_the_list_pages_and_leaves_a_retired_agent_out_until_the_person_asks_and_its_card_says_who_retired_it_and_why(ended):
    helper = helper_agent(ended)
    for session in ("s-31", "s-32", "s-33"):
        ended.expect_success(f"agent end {ended.new_row_id(f'agent start {session} claude worker --environment main')}", actor=ended.user)
    with viewer_client(ended) as person:
        viewer_retirement(person, helper)
        first_page, second_page = cards(person, "--show", "idle", "--limit", "2"), cards(person, "--show", "idle", "--limit", "2", "--page", "2")
        retired = own_cards(person, "--show", "retired")
        retired_card = card(person, helper.number)
    listed = [row["number"] for row in (*first_page["rows"], *second_page["rows"])]
    ended.expect_rows(len(first_page["rows"]) == 2, first_page["total"] == 3, len(listed) == len(set(listed)) == 3, helper.number not in listed, detail=str(listed))
    ended.expect_rows([row["number"] for row in retired] == [helper.number], detail=str(retired))
    ended.expect_rows(retired_card["state"] == "retired", retired_card["retirement_reason"] == RETIREMENT_REASON, retired_card["retired_at"] == helper_agent(ended).retired_at.text,
                      retired_card["retiring_actor_name"] == "Ada", retired_card["memory_count"] == 0, detail=str(retired_card))
