from pathlib import Path

COMBINED_RUN = (
    "tests/stories/suites/coding/main_controls.py", "tests/stories/suites/coding/settings_access.py", "tests/stories/suites/coding/agent_settings_window.py",
    "tests/stories/suites/coding/main_openings.py", "tests/stories/suites/coding/main_settings_migration.py", "tests/stories/suites/coding/main_driver_migration.py",
    "tests/stories/suites/coding/main_driver_registration.py", "tests/stories/suites/coding/work_settings.py", "tests/stories/suites/coding/policy_setting_writes.py",
    "tests/stories/suites/coding/policy_request_approval.py", "tests/stories/suites/coding/policy_environment_refresh.py", "tests/stories/suites/coding/refusal_texts.py",
    "tests/stories/core/modules/agents/agent_kind_controls.py", "tests/stories/core/modules/agents/agent_groups.py", "tests/stories/core/modules/agents/agent_limits.py",
    "tests/stories/suites/coding/modules/workers/worker_testing_controls.py", "tests/stories/suites/coding/modules/workers/merge_followup_plan.py",
    "tests/stories/suites/coding/auto_mode.py", "tests/stories/suites/coding/work_mode_window.py", "tests/stories/suites/coding/work_modes_skill.py",
    "tests/stories/core/modules/helpers/helper_job_budget.py", "tests/unit/core/base/registry/test_setting_rule_text.py", "tests/unit/core/modules/helpers/test_helper_spend.py",
)
ROOT = Path(__file__).resolve().parents[4]


def test_every_file_of_the_combined_run_exists():
    missing = [name for name in COMBINED_RUN if not (ROOT / name).is_file()]
    assert not missing, missing
