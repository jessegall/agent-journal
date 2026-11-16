from suites.coding.support.shipped_profiles import MERGER_PROFILE, WORKER_MEDIOR_PROFILE
from suites.coding.support.coding_settings import WORKER_KEPT_LIMIT, WORKER_RUN_LIMIT
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT, HELPER_KEPT_LIMIT, HELPER_PROFILE_LIMITS
import json

from engine.registry.registry import Registry

SAMPLE_MODULES = "tests.stories.engine.module.support.agent_type_modules"
HELPER_LINE = "Reads the project and reports; it changes no code."


def registered(journal) -> dict[str, dict[str, object]]:
    return {entry["key"]: entry for entry in json.loads(Registry.read(journal.database).entries_text())["helper_types"]}


def expect_fields(journal, key: str, **fields: object) -> None:
    stored = registered(journal)[key]
    assert {name: stored.get(name) for name in fields} == fields, stored


def extends(journal, key: str, base: str) -> bool:
    return Registry.read(journal.database).helper_type_book().extends(key, base)


def test_a_worker_and_a_merger_are_helpers_and_the_main_agent_and_the_worker_are_apart(journal):
    assert extends(journal, "worker", "helper") and extends(journal, "merger", "helper")
    assert not extends(journal, "main", "helper") and not extends(journal, "merger", "worker")


def test_a_merger_takes_the_fields_of_the_helper_it_does_not_set(journal):
    expect_fields(journal, "merger", label="Merger", default_profile=MERGER_PROFILE.name, access="read-only", separate_folder=False, run_limit_key=HELPER_RUN_LIMIT,
                  kept_limit_key=HELPER_KEPT_LIMIT, profile_limits_key=HELPER_PROFILE_LIMITS, job_command=["helper", "send"], line=HELPER_LINE)


def test_a_helper_type_keeps_no_extends_text(journal):
    stored = registered(journal)
    assert "extends" not in stored["worker"] and "extends" not in stored["merger"]


def test_a_class_that_names_a_base_extends_it(journal):
    journal.expect_sync_success(f"{SAMPLE_MODULES}:Clerk")
    assert extends(journal, "clerk", "helper")


def test_the_helper_and_the_worker_are_registered_as_before_the_classes(journal):
    expect_fields(journal, "helper", label="Read-only helper", access="read-only", separate_folder=False, default_profile="", start_line="", roster=None,
                  run_limit_key=HELPER_RUN_LIMIT, kept_limit_key=HELPER_KEPT_LIMIT, profile_limits_key=HELPER_PROFILE_LIMITS, job_command=["helper", "send"],
                  job_task_flag="", line=HELPER_LINE)
    expect_fields(journal, "worker", module="journal.suites.coding.workers", label="Worker", access="writing", separate_folder=True,
                  default_profile=WORKER_MEDIOR_PROFILE.name, start_line="journal worker dispatch",
                  roster={"text": "suites.coding.modules.workers.bindings.worker_roster:WorkerRoster"},
                  run_limit_key=WORKER_RUN_LIMIT, kept_limit_key=WORKER_KEPT_LIMIT,
                  profile_limits_key="", job_command=["worker", "send"], job_task_flag="--task", line="Writes the code of a task in a separate worktree.")
    expect_fields(journal, "merger", module="journal.suites.coding.workers")


def expect_behaviours(journal, key: str, **answers: bool) -> None:
    behaviours = registered(journal)[key]["behaviours"]
    assert {name: behaviours.get(name) for name in answers} == answers, behaviours


def expect_suite_lines(journal, suite: str, *texts: str) -> None:
    shown = journal.run(f"suite show {suite}")
    assert all(text in shown.text for text in texts), shown.text


def test_opening_the_worker_class_shows_its_key_access_driver_roster_and_limits(journal):
    expect_suite_lines(journal, "coding", "worker: coding.worker")
    expect_fields(journal, "worker", access="writing", roster={"text": "suites.coding.modules.workers.bindings.worker_roster:WorkerRoster"},
                  run_limit_key=WORKER_RUN_LIMIT, kept_limit_key=WORKER_KEPT_LIMIT)
    expect_behaviours(journal, "worker", takes_tasks=True, takes_prompts=True, takes_marks=True, runs_plugins=True, dispatches=True)


def test_the_suites_list_no_roles_per_behaviour_and_a_worker_still_takes_its_work(journal):
    suites = {entry["name"]: entry for entry in json.loads(Registry.read(journal.database).entries_text())["suites"]}
    assert "agent_policy" not in suites["coding"] and "defaults" not in suites["coding"]
    expect_behaviours(journal, "worker", takes_tasks=True, takes_prompts=True, takes_marks=True, runs_plugins=True, dispatches=True)
    expect_behaviours(journal, "helper", takes_tasks=False, takes_prompts=False, takes_marks=True, runs_plugins=False, dispatches=False)


def test_the_cores_own_helper_type_is_written_the_same_way_as_the_worker(journal):
    expect_suite_lines(journal, "coding", "helper: coding.helper", "merger: coding.merger")
    expect_fields(journal, "helper", access="read-only", run_limit_key=HELPER_RUN_LIMIT, kept_limit_key=HELPER_KEPT_LIMIT)
    expect_behaviours(journal, "helper", takes_marks=True, runs_saved_commands=True)
