from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.core.support.fixtures import MainEnvironment

SAMPLE_MODULES = "tests.stories.engine.module.support.agent_type_modules"
HELPER_RUN_LIMIT = "journal.core.helpers.read-only-helper-run-limit"
HELPER_KEPT_LIMIT = "journal.core.helpers.read-only-helper-kept-limit"
HELPER_PROFILE_LIMITS = "journal.core.helpers.read-only-helper-profile-limits"
HELPER_LINE = "Reads the project and reports; it changes no code."


def test_a_worker_is_a_helper_and_the_main_agent_is_not(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_helper_type_extends("worker", "helper")
    story.expect_helper_type_apart_from("main", "helper")


def test_a_merger_is_a_helper(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_helper_type_extends("merger", "helper")
    story.expect_helper_type_apart_from("merger", "worker")


def test_a_merger_takes_the_fields_of_the_helper_it_does_not_set(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_registered_helper_type("merger", label="Merger", default_profile="journal-merger",
                                        access="read-only", separate_folder=False, run_limit_key=HELPER_RUN_LIMIT,
                                        kept_limit_key=HELPER_KEPT_LIMIT, profile_limits_key=HELPER_PROFILE_LIMITS,
                                        job_command=["helper", "send"], line=HELPER_LINE)


def test_a_helper_type_keeps_no_extends_text(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_helper_type_field_absent("worker", "extends")
    story.expect_helper_type_field_absent("merger", "extends")


def test_a_class_that_names_a_base_extends_it(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLE_MODULES}:Clerk")
    story.expect_helper_type_extends("clerk", "helper")
    story.expect_success("agent start clerk-session claude clerk --environment main", "role: clerk")


def test_the_helper_and_the_worker_are_registered_as_before_the_classes(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_registered_helper_type("helper", label="Read-only helper", access="read-only", separate_folder=False,
                                        default_profile="", start_line="", roster=None, run_limit_key=HELPER_RUN_LIMIT,
                                        kept_limit_key=HELPER_KEPT_LIMIT, profile_limits_key=HELPER_PROFILE_LIMITS,
                                        job_command=["helper", "send"], job_task_flag="", line=HELPER_LINE)
    story.expect_registered_helper_type("worker", module="journal.suites.coding.workers", label="Worker", access="writing",
                                        separate_folder=True, default_profile="journal-worker-medior",
                                        start_line="journal worker dispatch",
                                        roster={"text": "suites.coding.modules.workers.bindings.worker_roster:WorkerRoster"},
                                        run_limit_key="journal.suites.coding.workers.worker-run-limit",
                                        kept_limit_key="journal.suites.coding.workers.worker-kept-limit", profile_limits_key="",
                                        job_command=["worker", "send"], job_task_flag="--task",
                                        line="Writes the code of a task in a worktree of its own.")
    story.expect_registered_helper_type("merger", module="journal.suites.coding.workers")
