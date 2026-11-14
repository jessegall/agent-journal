import json

from engine.registry.registry import Registry

SAMPLE_MODULES = "tests.stories.engine.module.support.agent_type_modules"
HELPER_RUN_LIMIT = "journal.core.helpers.read-only-helper-run-limit"
HELPER_KEPT_LIMIT = "journal.core.helpers.read-only-helper-kept-limit"
HELPER_PROFILE_LIMITS = "journal.core.helpers.read-only-helper-profile-limits"
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
    expect_fields(journal, "merger", label="Merger", default_profile="journal-merger", access="read-only", separate_folder=False, run_limit_key=HELPER_RUN_LIMIT,
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
                  default_profile="journal-worker-medior", start_line="journal worker dispatch",
                  roster={"text": "suites.coding.modules.workers.bindings.worker_roster:WorkerRoster"},
                  run_limit_key="journal.suites.coding.workers.worker-run-limit", kept_limit_key="journal.suites.coding.workers.worker-kept-limit",
                  profile_limits_key="", job_command=["worker", "send"], job_task_flag="--task", line="Writes the code of a task in a separate worktree.")
    expect_fields(journal, "merger", module="journal.suites.coding.workers")
