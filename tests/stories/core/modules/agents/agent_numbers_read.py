import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.support.numbered_agents import ShopWithThreeAgents, TwoEnvironments, listed, main_of, worker_of

LIST_HINT = "journal agent list"
OWN_ENVIRONMENT_REFUSAL = "works only in its own environment"
PROBED_NUMBERS = range(1, 101)


def absent_refusal(number: int, environment: str) -> str:
    return f"no agent {number} in environment {environment}"


def test_agent_show_reads_the_number_in_the_environment_of_the_line(new_story):
    story = new_story(fixture=TwoEnvironments)
    in_shop = json.loads(story.run("agent show 2 --environment shop --json", actor=story.user).output_text)
    in_main = json.loads(story.run("agent show 2 --environment main --json", actor=story.user).output_text)
    story.expect_rows(in_shop["id"] == worker_of(story, "shop"), in_main["id"] == worker_of(story, "main"), in_shop["id"] != in_main["id"])


def test_worker_send_reaches_the_worker_with_that_number_in_the_senders_environment_only(new_story):
    story = new_story(fixture=ShopWithThreeAgents)
    story.expect_refusal('worker send 3 "Total the till"', "worker 3 has no worktree", actor=main_of(story, "shop"))
    story.expect_refusal('worker send 3 "Total the till"', absent_refusal(3, "main"), actor=story.agent)


@pytest.mark.parametrize("number", [9, 833, 3], ids=["a number nobody has", "an old row id", "a number of another environment"])
def test_a_number_that_is_no_agent_here_gets_one_refusal_and_changes_nothing(new_story, number):
    story = new_story(fixture=ShopWithThreeAgents)
    agents = listed(story)
    refused = story.run(f"agent show {number}", actor=story.agent).output_text
    story.expect_rows(absent_refusal(number, "main") in refused, LIST_HINT in refused, "shop" not in refused, listed(story) == agents, detail=refused)
    story.expect_refusal(f'worker send {number} "Total the till"', absent_refusal(number, "main"), actor=story.agent)


def test_the_viewer_names_an_agent_by_its_row_and_reaches_it_in_the_environment_of_the_line_only(new_story):
    story = new_story(fixture=TwoEnvironments)
    shop_worker = worker_of(story, "shop")
    shown = json.loads(story.run(f"agent show row:{shop_worker} --environment shop --json", actor=story.user).output_text)
    story.expect_rows(shown["id"] == shop_worker, shown["number"] == 2)
    absent = "no agent with row {row} in environment main"
    story.expect_refusal(f"agent show row:{shop_worker} --environment main", absent.format(row=shop_worker), actor=story.user)
    story.expect_refusal("agent show row:9999 --environment main", absent.format(row=9999), actor=story.user)


def test_an_agent_naming_another_environment_is_refused_before_any_number_is_read(new_story):
    story = new_story(fixture=TwoEnvironments)
    for number in (2, 9):
        refused = story.run(f"agent show {number} --environment shop", actor=story.agent).output_text
        story.expect_rows(OWN_ENVIRONMENT_REFUSAL in refused, "no agent" not in refused, detail=refused)


@pytest.mark.parametrize("argument", ["0", "-3", "1e3", "12345678901234567890"])
def test_a_number_that_is_no_positive_whole_number_is_a_usage_refusal(new_story, argument):
    story = new_story(fixture=TwoEnvironments)
    story.expect_usage_error(f"agent show {argument}", actor=story.agent)
    story.expect_usage_error(f'worker send {argument} "Total the till"', actor=story.agent)


def test_a_message_to_agent_two_reaches_agent_two_of_the_senders_environment_and_agent_one_is_the_main(new_story):
    story = new_story(fixture=TwoEnvironments)
    shop_main, shop_worker = main_of(story, "shop"), Actor(worker_of(story, "shop"), ActorType.AGENT)
    worker_message = story.new_row_id('message send "Count the till" --to agent:2', actor=shop_main)
    main_message = story.new_row_id('message send "The till is counted" --to agent:1', actor=shop_worker)
    targets = {row["id"]: row["target_agent_id"] for row in json.loads(story.run("message list --environment shop --json", actor=story.user).output_text)["rows"]}
    story.expect_rows(targets[worker_message] == shop_worker.id, targets[main_message] is None, detail=str(targets))
    story.expect_text("message reports", "The till is counted", actor=shop_main)


def test_an_agent_probing_one_hundred_numbers_learns_only_its_own_environment(new_story):
    story = new_story(fixture=ShopWithThreeAgents)
    answers = {number: story.run(f"agent show {number}", actor=story.agent).output_text for number in PROBED_NUMBERS}
    refusals = {number: text.replace(str(number), "N") for number, text in answers.items() if "no agent" in text}
    story.expect_rows(sorted(set(answers) - set(refusals)) == [1, 2], len(set(refusals.values())) == 1, not any("shop" in text for text in answers.values()))
