import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, StartedHelper, helper_agent
from tests.stories.core.modules.helpers.lifetime_reviewers import launches
from tests.stories.core.modules.helpers.rotation_mid_job import session_rows

CODEX_MODEL = "gpt-6.1-sol"
DRIVER = "agent driver {number} --program {program} --model {model} --environment main"
MEMORY_TEXT = "The cart rounds each line before it adds them"


@pytest.fixture
def ended(new_story):
    return new_story(fixture=EndedHelper)


def test_a_person_moves_a_stopped_helper_to_codex_and_its_next_job_runs_on_codex_with_its_number_and_memories(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    ended.expect_success(DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL), actor=ended.user)
    command = launches(ended, f'helper send {helper.number} "{JOB}"')[0]["command"]
    moved = helper_agent(ended)
    ended.expect_rows(moved.id == helper.id, moved.number == helper.number, (moved.program, moved.program_model) == ("codex", CODEX_MODEL), moved.profile == helper.profile,
                      moved.retired_at is None, command[0] == "codex", detail=str(command[:4]))
    ended.expect_text("memory list", MEMORY_TEXT, actor=Actor(helper.id, ActorType.AGENT))


def test_a_person_who_changes_the_driver_of_a_running_helper_is_told_to_stop_it_first_and_nothing_changes(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL),
                         f"helper {helper.number} is running: journal agent stop {helper.number}, then change its driver", actor=story.user)
    running = helper_agent(story)
    story.expect_rows((running.program, running.program_model, running.session) == (helper.program, helper.program_model, helper.session))


def test_a_person_who_names_a_model_the_profile_does_not_allow_is_refused_with_the_allowed_models_and_nothing_changes(ended):
    helper = helper_agent(ended)
    refused = ended.run(DRIVER.format(number=helper.number, program=helper.program, model="no-such-model"), actor=ended.user)
    kept = helper_agent(ended)
    ended.expect_rows(refused.code == 1, "no-such-model" in refused.output_text, helper.program_model in refused.output_text,
                      (kept.program, kept.program_model, kept.session) == (helper.program, helper.program_model, helper.session), detail=refused.output_text)


def test_a_person_who_changes_only_the_model_gives_the_helper_a_new_session_of_the_same_program(ended):
    helper = helper_agent(ended)
    ended.expect_success(DRIVER.format(number=helper.number, program=helper.program, model="opus"), actor=ended.user)
    moved, rows = helper_agent(ended), session_rows(ended)
    ended.expect_rows((moved.program, moved.program_model) == (helper.program, "opus"), moved.session != helper.session,
                      [(row["session"], row["end_reason"]) for row in rows] == [(moved.session, None), (helper.session, "driver_changed")], detail=str(rows))


def test_the_session_history_keeps_the_session_of_the_old_program_after_a_driver_change(ended):
    helper = helper_agent(ended)
    ended.expect_success(DRIVER.format(number=helper.number, program="codex", model=CODEX_MODEL), actor=ended.user)
    ended.expect_text(f"agent sessions {helper.number} --environment main", helper.session, "driver_changed", helper_agent(ended).session, actor=ended.user)
    rows = session_rows(ended)
    ended.expect_rows([row["program"] for row in rows] == ["codex", helper.program], detail=str(rows))
