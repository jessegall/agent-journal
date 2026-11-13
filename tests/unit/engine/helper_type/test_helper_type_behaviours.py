import json
import os
from dataclasses import fields
from pathlib import Path

from engine.agent.agent_policy import AgentPolicy
from engine.helper_type.helper_type_book import MAIN_KEY
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.journal.journal_home import JournalHome
from engine.module.driver_entries import DriverEntries
from engine.module.module_finder import ModuleFinder
from engine.registry.suite_entry import SuiteEntry

TABLE_FILE = Path(__file__).resolve().parents[4] / "tests" / "snapshots" / "helper_type_behaviours.json"
UPDATE_FLAG = "JOURNAL_UPDATE_HELPER_TYPE_BEHAVIOURS"
SUITE_NAME = "coding"
ROLES_SUFFIX = "_roles"
AGENT_PAGE = "agent"


def coding_suite(finder: ModuleFinder) -> SuiteEntry:
    modules = finder.default_modules()
    return next(entry for entry in DriverEntries().suites(modules, modules, finder.suite_list()) if entry.name == SUITE_NAME)


def helper_types(finder: ModuleFinder) -> dict[str, HelperTypeEntry]:
    suites = finder.suite_list()
    return {declaration.key: HelperTypeEntry.declared(module.name, declaration) for module in finder.default_modules() for declaration in suites.helper_types(module)}


def policy_behaviours(policy: AgentPolicy, key: str) -> dict[str, object]:
    behaviours: dict[str, object] = {field.name.removesuffix(ROLES_SUFFIX): key in getattr(policy, field.name) for field in fields(AgentPolicy) if field.name.endswith(ROLES_SUFFIX)}
    behaviours["queue_limit_settings"] = list(policy.queue_limit_settings) if key in policy.queued_run_roles else []
    return behaviours


def suite_behaviours(suite: SuiteEntry, key: str) -> dict[str, object]:
    driver = suite.defaults.get(key, "")
    driver_page = f"{AGENT_PAGE}@{driver}"
    return {"driver": driver, "layout": driver_page if driver_page in suite.layouts else AGENT_PAGE}


def type_behaviours(entry: HelperTypeEntry) -> dict[str, object]:
    return {"access": entry.access.value, "separate_folder": entry.separate_folder, "bases": list(entry.bases), "default_profile": entry.default_profile,
            "start_line": entry.start_line, "roster": entry.roster.text if entry.roster is not None else "", "run_limit": entry.run_limit_key,
            "kept_limit": entry.kept_limit_key, "profile_limits": entry.profile_limits_key, "job_command": list(entry.job_command), "job_task_flag": entry.job_task_flag}


def live_table(tmp_path: Path) -> dict[str, dict[str, object]]:
    finder = ModuleFinder(JournalHome(tmp_path))
    suite, types = coding_suite(finder), helper_types(finder)
    table = {MAIN_KEY: {**policy_behaviours(suite.agent_policy, MAIN_KEY), **suite_behaviours(suite, MAIN_KEY)}}
    for key, entry in sorted(types.items()):
        table[key] = {**policy_behaviours(suite.agent_policy, key), **suite_behaviours(suite, key), **type_behaviours(entry)}
    return table


def changed_answers(recorded: dict[str, dict[str, object]], live: dict[str, dict[str, object]]) -> list[str]:
    keys = sorted(set(recorded) | set(live))
    return [f"{key} {behaviour}: before {recorded.get(key, {}).get(behaviour)!r}, after {live.get(key, {}).get(behaviour)!r}"
            for key in keys for behaviour in sorted(set(recorded.get(key, {})) | set(live.get(key, {})))
            if recorded.get(key, {}).get(behaviour) != live.get(key, {}).get(behaviour)]


def test_every_helper_type_and_the_main_agent_answer_every_behaviour_as_the_table_recorded(tmp_path):
    live = live_table(tmp_path)
    if os.environ.get(UPDATE_FLAG):
        TABLE_FILE.write_text(json.dumps(live, indent=2) + "\n")
    recorded = json.loads(TABLE_FILE.read_text())
    assert not changed_answers(recorded, live), "\n".join(changed_answers(recorded, live))


def test_the_table_names_the_main_agent_the_worker_the_merger_and_the_helper():
    recorded = json.loads(TABLE_FILE.read_text())
    assert set(recorded) == {MAIN_KEY, "worker", "merger", "helper"}
    assert recorded["worker"]["job"] is True and recorded["helper"]["job"] is False


def test_a_changed_answer_names_the_type_the_behaviour_the_before_and_the_after():
    recorded = {"worker": {"job": True, "driver": "coding.worker"}}
    live = {"worker": {"job": False, "driver": "coding.worker"}}
    assert changed_answers(recorded, live) == ["worker job: before True, after False"]


def test_a_type_that_appears_or_goes_is_named_with_each_of_its_behaviours():
    assert changed_answers({}, {"reviewer": {"job": False}}) == ["reviewer job: before None, after False"]
    assert changed_answers({"verifier": {"job": False}}, {}) == ["verifier job: before False, after None"]
