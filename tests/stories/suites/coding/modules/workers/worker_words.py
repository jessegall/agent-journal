from pathlib import Path

import suites.coding.modules.workers as workers_package
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_step_text import STEP_TEXTS
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import PLAN_BUILDING
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTING_VALUES
from suites.coding.support.profile_commands import WORKER_COMMANDS as PROFILE_WORKER_COMMANDS
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_RULES
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, worker_session
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, unplanned_worker
from tests.stories.suites.coding.modules.workers.worker_profiles import dispatched_brief
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from tests.stories.support.story_checks import expect_value, expect_value_4, expect_value_with, expect_value_without

WORKER_COMMANDS = ("journal worker commit", "journal proof make", "journal task start")
MERGER_COMMANDS = ("journal merger answer", "journal merger defer-test", "journal merger tell")
REQUEST_SENTENCE = "after you ask, the merger or the journal settles it and you are woken"


def skill_text(name: str) -> str:
    text = (Path(workers_package.__file__).parent / "skills" / name / "SKILL.md").read_text()
    return " ".join(text.split())


def test_76a_the_opening_text_of_a_worker_names_proof_start_and_commit_and_no_deliver_or_batch_of_tasks(new_story):
    story, brief = dispatched_brief(new_story, DISPATCH)
    worker_id = story.container.get(WorktreeQuery).open_worktrees()[0].session_agent_id
    session = worker_session(story, Actor(worker_id, ActorType.AGENT))
    opening = " ".join([brief, *story.hook(session, HookSamples.session_start()).lines])
    story.expect_rows(*(command in opening for command in WORKER_COMMANDS), detail=opening)
    story.expect_rows("journal worker deliver" not in opening, "worker next judges" not in opening, not [word for word in ("this group", "the group", "group of", "batch") if word in opening.lower()], detail=opening)


def test_76b_the_workers_skill_names_proof_start_and_commit_and_no_deliver_group_or_batch_setting(new_story):
    text = skill_text("journal-worker")
    expect_value_4(all(command in text for command in WORKER_COMMANDS))
    expect_value_4(not [word for word in ("deliver", "test-batch-size", "test-at-phase-end", "group") if word in text.lower()])


def test_76c_every_step_text_is_in_plain_words_and_the_commit_step_has_one(new_story):
    texts = " ".join(part for text in STEP_TEXTS.values() for part in (text.outcome_text, text.action_text, text.next_text))
    expect_value_with(STEP_TEXTS, WorkerStep.COMMIT)
    expect_value_4(not [word for word in ("group", "batch", "journal worker deliver", "hand in", "handed in") if word in texts.lower()])


def test_76d_the_lines_a_worker_hears_at_a_failed_test_and_after_its_last_commit_say_commit_and_not_hand_in(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    committed_line = worker.status_line()
    worker.end_tests(1)
    failed_line = next(line for line in worker.worker_lines() if "tests failed" in line)
    worker.story.expect_rows("journal worker commit" in failed_line, "hand in" not in failed_line, "journal worker deliver" not in failed_line, detail=failed_line)
    worker.story.expect_rows("hand" not in committed_line, "deliver" not in committed_line, detail=committed_line)


def test_76e_the_workers_skill_keeps_what_happens_after_an_ask_and_the_merger_keeps_its_three_commands(new_story):
    merger_profile = next(profile for profile in HELPER_PROFILES if profile.name == f"{MERGER_PROFILE.name}")
    expect_value_with(skill_text("journal-worker").lower(), REQUEST_SENTENCE)
    expect_value_4(all(command in skill_text(f"{MERGER_PROFILE.name}") for command in MERGER_COMMANDS))
    expect_value_4(all(command in merger_profile.body for command in MERGER_COMMANDS))


def test_204_the_old_name_worker_deliver_answers_with_the_command_that_took_its_place(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    refused = worker.story.run("worker deliver --wait --differences none", actor=worker.worker)
    worker.story.expect_rows(refused.code != 0, "journal worker deliver is gone: use journal worker commit" in refused.output_text, detail=refused.output_text)


def test_207_no_setting_of_the_workers_says_batch_and_the_two_task_counts_say_what_they_count(new_story):
    titles = {setting.key: setting.title for setting in WORKER_SETTING_VALUES}
    phrased = " ".join(f"{setting.title} {setting.description}" for setting in WORKER_SETTING_VALUES).lower()
    expect_value_without(phrased, "batch")
    expect_value((titles["most-open-tasks"], titles["worker-batch-size"]), ("Tasks a worker may hold started at once", "Tasks handed to a worker at once"))


def test_209_the_profile_of_a_worker_says_proof_start_and_commit_and_the_planner_is_told_that_tests_run_at_a_checkpoint(new_story):
    profile_terms = f"{PROFILE_WORKER_COMMANDS} {WORKER_RULES}"
    checkpoint_step = next(step for step in PLAN_BUILDING.steps if "--checkpoint" in step)
    expect_value_4(all(command in profile_terms for command in WORKER_COMMANDS))
    expect_value_4(not [word for word in ("journal worker deliver", "end of its phase", "hand all in") if word in profile_terms])
    expect_value_with(checkpoint_step, "tests run")
