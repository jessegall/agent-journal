from pathlib import Path

from core.modules.sequences.commands.save_standard_sequences.standard_sequences import PLAN_BUILDING
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTING_VALUES
from suites.coding.modules.workers.support.worker_step_text import STEP_TEXTS
from suites.coding.support.profile_commands import WORKER_COMMANDS as PROFILE_WORKER_COMMANDS
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_RULES
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from tests.stories.support.story_checks import expect_value, expect_value_4, expect_value_with, expect_value_without
import suites.coding.modules.workers as workers_package

WORKER_COMMANDS = ("journal worker commit", "journal proof make", "journal task start")
MERGER_COMMANDS = ("journal merger answer", "journal merger defer-test", "journal merger tell")
REQUEST_SENTENCE = "after you ask, the merger or the journal settles it and you are woken"


def skill_text(name: str) -> str:
    text = (Path(workers_package.__file__).parent / "skills" / name / "SKILL.md").read_text()
    return " ".join(text.split())


def test_76b_the_workers_skill_names_proof_start_and_commit_and_no_deliver_group_or_batch_setting():
    text = skill_text(WORKER_PROFILE.name)
    expect_value_4(all(command in text for command in WORKER_COMMANDS))
    expect_value_4(not [word for word in ("deliver", "test-batch-size", "test-at-phase-end", "group") if word in text.lower()])


def test_76c_every_step_text_is_in_plain_words_and_the_commit_step_has_one():
    texts = " ".join(part for text in STEP_TEXTS.values() for part in (text.outcome_text, text.action_text, text.next_text))
    expect_value_with(STEP_TEXTS, WorkerStep.COMMIT)
    expect_value_4(not [word for word in ("group", "batch", "journal worker deliver", "hand in", "handed in") if word in texts.lower()])


def test_76e_the_workers_skill_keeps_what_happens_after_an_ask_and_the_merger_keeps_its_three_commands():
    merger_profile = next(profile for profile in HELPER_PROFILES if profile.name == f"{MERGER_PROFILE.name}")
    expect_value_with(skill_text(WORKER_PROFILE.name).lower(), REQUEST_SENTENCE)
    expect_value_4(all(command in skill_text(f"{MERGER_PROFILE.name}") for command in MERGER_COMMANDS))
    expect_value_4(all(command in merger_profile.body for command in MERGER_COMMANDS))


def test_207_no_setting_of_the_workers_says_batch_and_the_two_task_counts_say_what_they_count():
    titles = {setting.key: setting.title for setting in WORKER_SETTING_VALUES}
    phrased = " ".join(f"{setting.title} {setting.description}" for setting in WORKER_SETTING_VALUES).lower()
    expect_value_without(phrased, "batch")
    expect_value((titles["most-open-tasks"], titles["worker-batch-size"]), ("Tasks a worker may hold started at once", "Tasks handed to a worker at once"))


def test_209_the_profile_of_a_worker_says_proof_start_and_commit_and_the_planner_is_told_that_tests_run_at_a_checkpoint():
    profile_terms = f"{PROFILE_WORKER_COMMANDS} {WORKER_RULES}"
    checkpoint_step = next(step for step in PLAN_BUILDING.steps if "--checkpoint" in step)
    expect_value_4(all(command in profile_terms for command in WORKER_COMMANDS))
    expect_value_4(not [word for word in ("journal worker deliver", "end of its phase", "hand all in") if word in profile_terms])
    expect_value_with(checkpoint_step, "tests run")
