import json
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULES = (
    "architecture_agents_agent_retired_outside_the_retire_command",
    "architecture_agents_retirement_run_by_code",
    "architecture_agents_retire_command_in_a_text",
    "architecture_agents_driver_changed_outside_the_driver_command",
    "architecture_agents_number_read_without_an_environment",
    "architecture_agents_number_returned_as_its_row_id",
    "architecture_workers_later_branch_named_by_hand",
)
CLASS_FILES = {
    "RetireAgentHandler": "src/core/modules/agents/commands/retire_agent/retire_agent_handler.py",
    "RetireAgentSubcommand": "src/core/modules/agents/commands/retire_agent/retire_agent_subcommand.py",
    "RetiredDeleteGuard": "src/core/modules/agents/guards/retired_delete_guard.py",
    "RetiredRowGuard": "src/core/modules/agents/guards/retired_row_guard.py",
    "ChangeAgentDriverHandler": "src/core/modules/helpers/commands/change_agent_driver/change_agent_driver_handler.py",
    "EndReason": "src/core/modules/agents/models/enums/end_reason.py",
    "AgentRowNumbers": "src/core/modules/agents/bindings/agent_row_numbers.py",
    "WorkerBranchNames": "src/suites/coding/modules/workers/support/worker_branch_names.py",
    "TypeLimits": "src/core/modules/agents/support/type_limits.py",
    "RetireAgent": "src/core/modules/agents/commands/retire_agent/retire_agent.py",
    "ChangeAgentDriver": "src/core/modules/helpers/commands/change_agent_driver/change_agent_driver.py",
}
SAMPLE = CUSTOM / "samples" / "agents" / "idle_worker_cleaner.py"


def declared_rule(rule: str) -> dict:
    return json.loads((CUSTOM / f"{rule}.json").read_text())


@pytest.mark.parametrize("rule", RULES)
def test_the_detector_exists_is_enrolled_and_teaches_through_a_skill_that_exists(rule):
    declared = declared_rule(rule)
    assert declared["engine"] == "python"
    assert rule in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert (CUSTOM / "skills" / declared["sin"]["skill"] / "SKILL.md").is_file()


@pytest.mark.parametrize("rule", RULES)
def test_every_class_a_detector_names_still_sits_in_its_file(rule):
    declared = declared_rule(rule)
    allowed = [name for step in declared["find"].get("reject", []) for name in step.get("nameIn", [])]
    taught = [name for name in CLASS_FILES if name in declared["sin"]["rule"]]
    for name in (*allowed, *taught):
        assert f"class {name}" in (ROOT / CLASS_FILES[name]).read_text(), f"{name} is not in {CLASS_FILES[name]}"


def test_each_detector_fires_on_the_bad_example_and_stays_silent_on_the_good_one(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": list(RULES)}))
    for name in RULES:
        shutil.copyfile(CUSTOM / f"{name}.json", custom / f"{name}.json")
    shutil.copytree(CUSTOM / "skills" / "drivers-architecture", custom / "skills" / "drivers-architecture")
    shutil.copyfile(SAMPLE, custom / "samples" / "idle_worker_cleaner.py")
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=180)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in RULES:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout
