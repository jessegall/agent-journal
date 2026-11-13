import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_driver import CODEX_MODEL, DRIVER
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, helper_agent
from tests.stories.core.modules.helpers.lifetime_reviewers import refusal_text
from tests.stories.core.modules.usage.support.status_files import full_status
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.program_split import outage
from tests.stories.support.program_states import real_program_states

OLD_SESSION_DOLLARS = 1.5
NEW_SESSION_DOLLARS = 0.25


@pytest.fixture
def ended(new_story):
    story = new_story(fixture=EndedHelper)
    real_program_states(story)
    return story


def codex_driver_line(story, number: int) -> str:
    return DRIVER.format(number=number, program="codex", model=CODEX_MODEL)


def test_the_main_agent_changes_the_driver_of_its_helper(ended):
    helper = helper_agent(ended)
    ended.expect_success(codex_driver_line(ended, helper.number), actor=ended.agent)
    moved = helper_agent(ended)
    ended.expect_rows((moved.program, moved.program_model) == ("codex", CODEX_MODEL), moved.session != helper.session, moved.number == helper.number)


def test_a_helper_that_changes_the_driver_of_another_agent_is_refused_naming_who_may(ended):
    helper = helper_agent(ended)
    main_number = agent_number(ended, ended.agent.id)
    ended.expect_refusal(DRIVER.format(number=main_number, program="codex", model=CODEX_MODEL), "only a user or the main agent changes a driver", actor=Actor(helper.id, ActorType.AGENT))
    ended.expect_text(f"agent show {main_number} --environment main", "program: claude", actor=ended.user)


def test_an_agent_that_changes_its_own_driver_is_refused(ended):
    main_number = agent_number(ended, ended.agent.id)
    ended.expect_refusal(DRIVER.format(number=main_number, program="codex", model=CODEX_MODEL), "an agent does not change its own driver", actor=ended.agent)
    ended.expect_text(f"agent show {main_number} --environment main", "program: claude", actor=ended.user)


def test_a_driver_changed_to_a_program_that_is_out_says_when_it_is_back_and_the_next_job_waits_on_it(ended):
    helper = helper_agent(ended)
    _, ends_at = outage(ended, "codex", 30)
    answer = ended.run(codex_driver_line(ended, helper.number), actor=ended.user)
    refusal = refusal_text(ended, f'helper send {helper.number} "{JOB}"')
    moved = helper_agent(ended)
    ended.expect_rows(answer.code == 0, "codex is out" in answer.output_text, moved.program == "codex", f"helper {helper.number} waits on codex" in refusal, moved.ended_at is not None,
                      detail=f"{answer.output_text} / {refusal} / outage until {ends_at}")


def test_the_spend_of_an_agent_is_counted_for_each_session_so_two_programs_are_not_mixed(ended):
    helper = helper_agent(ended)
    ended.expect_success(codex_driver_line(ended, helper.number), actor=ended.user)
    full_status(ended, helper.session, 40, OLD_SESSION_DOLLARS)
    full_status(ended, helper_agent(ended).session, 10, NEW_SESSION_DOLLARS)
    facts = json.loads(ended.run(f"usage agents --closed --agent {helper.number} --environment main --json", actor=ended.user).output_text)["rows"][0]
    ended.expect_rows([(cost["program"], cost["cost_dollars"]) for cost in facts["session_costs"]] == [("codex", NEW_SESSION_DOLLARS), (helper.program, OLD_SESSION_DOLLARS)],
                      facts["total_cost_dollars"] == OLD_SESSION_DOLLARS + NEW_SESSION_DOLLARS, detail=str(facts["session_costs"]))
