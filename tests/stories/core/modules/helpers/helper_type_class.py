import re
from pathlib import Path

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.core.support.fixtures import MainEnvironment

SOURCE = Path(__file__).resolve().parents[5] / "src"
SAMPLES = "tests.stories.core.modules.helpers.support.helper_type_samples"
WORKER_CLASS = "suites/coding/modules/workers/types/worker.py"
WORKER_ROLE_STRING = re.compile(r"""(==|!=)\s*["']worker["']|["']worker["']\s*(==|!=)|\(\s*["']main["']\s*,\s*["']worker["']""")
HELPER_RUN_LIMIT = "journal.core.helpers.read-only-helper-run-limit"
HELPER_KEPT_LIMIT = "journal.core.helpers.read-only-helper-kept-limit"


def test_opening_the_worker_class_shows_its_key_access_driver_roster_and_limits(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_text("suite show coding", "worker: coding.worker", actor=story.user)
    story.expect_registered_helper_type("worker", access="writing",
                                        roster={"text": "suites.coding.modules.workers.bindings.worker_roster:WorkerRoster"},
                                        run_limit_key="journal.suites.coding.workers.worker-run-limit",
                                        kept_limit_key="journal.suites.coding.workers.worker-kept-limit")
    story.expect_helper_type_behaviours("worker", takes_tasks=True, takes_prompts=True, takes_marks=True, runs_plugins=True, dispatches=True)


def test_no_file_but_the_worker_class_names_the_worker_as_a_role_string(new_story):
    story = new_story(fixture=MainEnvironment)
    naming = sorted(str(path.relative_to(SOURCE)) for path in SOURCE.rglob("*.py")
                    if str(path.relative_to(SOURCE)) != WORKER_CLASS and WORKER_ROLE_STRING.search(path.read_text()))
    story.expect_rows(naming == [], detail=str(naming))


def test_a_suite_that_adds_one_helper_type_as_one_class_can_start_it_with_its_own_driver(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ScribeSuite")
    story.expect_registered_helper_type("scribe", label="Scribe", access="read-only", bases=["helper"])
    story.expect_text("suite show scribe", "scribe: scribe.scribe", actor=story.user)
    story.expect_helper_type_behaviours("scribe", takes_marks=True, takes_tasks=False)
    story.expect_success("agent start scribe-session claude scribe --environment main", "role: scribe")


def test_a_helper_type_without_a_label_stops_the_boot_naming_the_type_and_the_field(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{SAMPLES}:NamelessScribeSuite", "helper type scribe has no label")


def test_the_suites_list_no_roles_per_behaviour_and_a_worker_still_takes_its_work(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_suite_field_absent("coding", "agent_policy")
    story.expect_suite_field_absent("coding", "defaults")
    story.expect_helper_type_behaviours("worker", takes_tasks=True, takes_prompts=True, takes_marks=True, runs_plugins=True, dispatches=True)
    story.expect_helper_type_behaviours("helper", takes_tasks=False, takes_prompts=False, takes_marks=True, runs_plugins=False, dispatches=False)


def test_two_suites_that_register_the_same_helper_type_stop_the_boot_naming_both(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ScribeSuite")
    story.expect_sync_refusal(f"{SAMPLES}:CopyScribeSuite", "suite copy-scribe and suite scribe both register helper type scribe")


def test_the_cores_own_helper_type_is_written_the_same_way_as_the_worker(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_text("suite show coding", "helper: coding.helper", "merger: coding.helper", actor=story.user)
    story.expect_registered_helper_type("helper", access="read-only", run_limit_key=HELPER_RUN_LIMIT, kept_limit_key=HELPER_KEPT_LIMIT)
    story.expect_helper_type_behaviours("helper", takes_marks=True, runs_saved_commands=True)


def test_an_ended_agent_of_a_type_no_module_registers_any_more_is_shown_retired_with_its_stored_key(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:RetiringModule")
    scribe = story.new_row_id("agent start scribe-session claude scribe --environment main")
    story.expect_success(f"agent end {scribe}", actor=story.user)
    story.expect_sync_without(f"{SAMPLES}:RetiringModule")
    story.run_listeners()
    story.expect_text(f"agent show {agent_number(story, scribe)}", "role: scribe", "retirement_reason: no installed module registers its type scribe any more", actor=story.user)
    story.expect_text("agent list --environment main", "scribe", actor=story.user)
