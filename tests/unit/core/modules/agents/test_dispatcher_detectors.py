import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[5]
CUSTOM = ROOT / ".commandments" / "custom"
PLUGIN = Path(".journal/plugins/code-commandments/bin/commandments-release")
IMPORT_RULE = "architecture_agents_launcher_reached_outside_the_dispatcher"
ROW_RULE = "architecture_agents_agent_row_ended_outside_the_dispatcher"
RULES = (IMPORT_RULE, ROW_RULE)
GUARDED_FILES = (
    "src/core/modules/agents/support/launcher_link.py",
    "src/core/modules/agents/support/launcher_service.py",
    "src/core/modules/agents/support/agent_program.py",
    "src/core/modules/agents/commands/record_agent_process/record_agent_process.py",
    "src/core/modules/agents/commands/record_agent_launch_failure/record_agent_launch_failure.py",
    "src/core/modules/helpers/commands/record_program_exit/record_program_exit.py",
)
GUARDED_NAMES = ("LauncherLink", "LauncherService", "AgentProgram", "RecordAgentProcess", "RecordAgentLaunchFailure", "RecordProgramExit")
ROW_WRITERS = {"AgentDispatcher": "src/core/modules/agents/support/agent_dispatcher.py", "Agent": "src/core/modules/agents/models/agent.py"}
ROW_WRITES = ("ended_at=", "pid=", ".ended(")
LAUNCHER_IMPORT = "from core.modules.agents.support.launcher_link import LauncherLink\n"
ROW_SAVE = '''class Agent:
    ended_at: str | None = None


class {owner}:
    def end(self, agent: Agent, repository: object) -> object:
        return repository.update(agent, ended_at="2026-10-31T09:00:00+00:00")
'''


def declared(rule: str) -> dict:
    return json.loads((CUSTOM / f"{rule}.json").read_text())


def allowed_files(rule: str) -> list[str]:
    return [step["file"] for step in declared(rule)["find"]["reject"] if "file" in step]


def executable() -> str:
    matched = next((str(folder / PLUGIN) for folder in (ROOT, *ROOT.parents) if (folder / PLUGIN).is_file()), None)
    if matched is None:
        pytest.skip("the code-commandments plugin is not installed")
    return matched


def project(folder: Path) -> Path:
    custom = folder / ".commandments" / "custom"
    custom.mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": list(RULES)}))
    for rule in RULES:
        shutil.copyfile(CUSTOM / f"{rule}.json", custom / f"{rule}.json")
    shutil.copytree(CUSTOM / "skills" / "drivers-architecture", custom / "skills" / "drivers-architecture")
    return folder


def matches(folder: Path, rule: str) -> str:
    completed_process = subprocess.run([executable(), "rule", "try", rule, "src"], cwd=folder, capture_output=True, text=True, timeout=30)
    return completed_process.stdout + completed_process.stderr


def saved(folder: Path, path: str, text: str) -> str:
    file = folder / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(text)
    return path


@pytest.mark.parametrize("rule", RULES)
def test_the_detector_is_enrolled_and_every_file_it_still_allows_exists(rule):
    assert rule in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert declared(rule)["sin"]["description"] and declared(rule)["sin"]["rule"]
    assert [path for path in allowed_files(rule) if not (ROOT / path).is_file()] == []


def test_every_module_the_import_detector_guards_still_sits_in_its_file():
    pattern = next(step["nameMatches"] for step in declared(IMPORT_RULE)["find"]["where"] if "nameMatches" in step)
    for path, name in zip(GUARDED_FILES, GUARDED_NAMES):
        module = path.removeprefix("src/").removesuffix(".py").replace("/", ".")
        assert re.search(pattern, module), f"the detector does not guard {module}"
        assert f"class {name}" in (ROOT / path).read_text(), f"{name} is not in {path}"


def test_every_file_the_import_detector_still_allows_imports_what_it_guards():
    stale = [path for path in allowed_files(IMPORT_RULE) if not any(re.search(rf"import .*\b{name}\b", (ROOT / path).read_text()) for name in GUARDED_NAMES)]
    assert stale == [], "these files no longer reach the launcher: take them off the detector's list"


def test_every_file_the_row_detector_still_allows_writes_the_row_and_its_writers_sit_in_their_files():
    stale = [path for path in allowed_files(ROW_RULE) if not any(write in (ROOT / path).read_text() for write in ROW_WRITES)]
    assert stale == [], "these files no longer write an agent's ended_at or pid: take them off the detector's list"
    writers = next(step["nameIn"] for step in declared(ROW_RULE)["find"]["reject"] if "nameIn" in step)
    assert sorted(writers) == sorted(ROW_WRITERS)
    for name, path in ROW_WRITERS.items():
        assert f"class {name}" in (ROOT / path).read_text(), f"{name} is not in {path}"


def test_both_detectors_flag_their_refused_samples_and_nothing_in_the_accepted_ones(tmp_path):
    folder = project(tmp_path)
    shutil.copytree(CUSTOM / "samples" / "dispatcher", folder / ".commandments" / "custom" / "samples" / "dispatcher")
    completed_process = subprocess.run([executable(), "rule", "prove"], cwd=folder, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for rule in RULES:
        assert f"✓ {rule}" in completed_process.stdout, completed_process.stdout


def test_552_a_developer_who_imports_the_launcher_link_outside_the_dispatchers_folder_is_refused_by_the_name_of_the_file(tmp_path):
    folder = project(tmp_path)
    outside = saved(folder, "src/suites/coding/modules/workers/support/terminal_count.py", LAUNCHER_IMPORT)
    saved(folder, "src/core/modules/agents/support/launcher_presence.py", LAUNCHER_IMPORT)
    matched = matches(folder, IMPORT_RULE)
    assert "terminal_count.py:1" in matched and "launcher_presence.py" not in matched and "1 match" in matched, f"{outside}: {matched}"


def test_553_a_developer_who_writes_an_agents_ended_at_outside_the_dispatcher_is_refused_by_the_name_of_the_file(tmp_path):
    folder = project(tmp_path)
    outside = saved(folder, "src/suites/coding/modules/workers/support/unused_worker_rows.py", ROW_SAVE.format(owner="UnusedWorkerRows"))
    saved(folder, "src/core/modules/agents/support/agent_dispatcher.py", ROW_SAVE.format(owner="AgentDispatcher"))
    matched = matches(folder, ROW_RULE)
    assert "unused_worker_rows.py:7" in matched and "agent_dispatcher.py" not in matched and "1 match" in matched, f"{outside}: {matched}"
