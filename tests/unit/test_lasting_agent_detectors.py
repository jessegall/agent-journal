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
SAMPLE = '''from enum import StrEnum


class Agent:
    number: int = 0

    def retired(self, reason: str) -> "Agent":
        return self


class RetireAgent:
    def __init__(self, agent_id: int, reason: str) -> None:
        self.agent_id, self.reason = agent_id, reason


class EndReason(StrEnum):
    DRIVER_CHANGED = "driver_changed"


class RetireAgentHandler:
    def handle(self, agent: Agent) -> Agent:
        # @righteous architecture_agents_agent_retired_outside_the_retire_command
        return agent.retired("its work is done")

    def reason_refusal(self, agent: Agent) -> str:
        # @righteous architecture_agents_retire_command_in_a_text
        return f'journal agent retire {agent.number} --reason "<why>"'


class RetireAgentSubcommand:
    def command(self, agent_id: int, reason: str) -> RetireAgent:
        # @righteous architecture_agents_retirement_run_by_code
        return RetireAgent(agent_id, reason)


class ChangeAgentDriverHandler:
    def reason(self) -> EndReason:
        # @righteous architecture_agents_driver_changed_outside_the_driver_command
        return EndReason.DRIVER_CHANGED


class AgentRowNumbers:
    def row_id(self, number: int, environment_id: int | None) -> int:
        # @righteous architecture_agents_number_read_without_an_environment
        if environment_id is None:
            raise ValueError("an agent is read in an environment")
        found_id = number + environment_id
        # @righteous architecture_agents_number_returned_as_its_row_id
        return found_id


class WorkerBranchNames:
    def branch(self, first_branch: str, position: int) -> str:
        # @righteous architecture_workers_later_branch_named_by_hand
        return f"{first_branch}-{position}"


class IdleWorkerCleaner:
    def clean(self, agent: Agent) -> Agent:
        # @sin architecture_agents_agent_retired_outside_the_retire_command
        return agent.retired("idle too long")

    def command(self, agent: Agent) -> RetireAgent:
        # @sin architecture_agents_retirement_run_by_code
        return RetireAgent(agent.number, "idle too long")

    def suggestion(self, agent: Agent) -> str:
        # @sin architecture_agents_retire_command_in_a_text
        return f"to make room: journal agent retire {agent.number}"

    def reason(self) -> EndReason:
        # @sin architecture_agents_driver_changed_outside_the_driver_command
        return EndReason.DRIVER_CHANGED

    def branch(self, first_branch: str, worktree_id: int) -> str:
        # @sin architecture_workers_later_branch_named_by_hand
        return first_branch + "-cut-" + str(worktree_id)


class LenientRowNumbers:
    def row_id(self, number: int, environment_id: int | None) -> int:
        # @sin architecture_agents_number_read_without_an_environment
        if environment_id is None:
            # @sin architecture_agents_number_returned_as_its_row_id
            return number
        return number + environment_id
'''


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
    (custom / "samples" / "idle_worker_cleaner.py").write_text(SAMPLE)
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in RULES:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout
