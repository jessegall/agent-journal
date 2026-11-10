import json
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULES = ("architecture_lockdown_launcher_asked_outside_the_launch_door", "architecture_lockdown_terminal_line_sent_past_the_gate")
ALLOWED_CLASS_FILES = {
    "AgentLauncher": "src/core/modules/agents/support/agent_launcher.py",
    "TerminalTyping": "src/core/modules/agents/support/terminal_typing.py",
    "LauncherLink": "src/core/modules/agents/support/launcher_link.py",
    "LaunchAgentHandler": "src/core/modules/agents/commands/launch_agent/launch_agent_handler.py",
}
SAMPLE = '''class LauncherLink:
    def request_launcher(self, request: dict, answer_bytes: int = 0) -> bytes:
        return b""


class TerminalTyping:
    def __init__(self, link: LauncherLink) -> None:
        self.link = link

    def type_line(self, agent: object, line: str) -> None:
        # @righteous architecture_lockdown_terminal_line_sent_past_the_gate
        self.send_line(1, line)

    def send_line(self, terminal_id: int, line: str) -> None:
        # @righteous architecture_lockdown_launcher_asked_outside_the_launch_door
        self.link.request_launcher({"typed": line})


class WorkerRestart:
    def __init__(self, link: LauncherLink, typing: TerminalTyping) -> None:
        self.link, self.typing = link, typing

    def restart(self) -> None:
        # @sin architecture_lockdown_launcher_asked_outside_the_launch_door
        self.link.request_launcher({"command": ["claude"]})
        # @sin architecture_lockdown_terminal_line_sent_past_the_gate
        self.typing.send_line(1, "go on")
'''


@pytest.mark.parametrize("rule", RULES)
def test_the_detector_exists_and_every_class_it_allows_still_sits_in_its_file(rule):
    declared = json.loads((CUSTOM / f"{rule}.json").read_text())
    allowed = next(step["nameIn"] for step in declared["find"]["reject"] if "nameIn" in step)
    assert declared["engine"] == "python" and allowed
    assert rule in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    for name in allowed:
        assert f"class {name}" in (ROOT / ALLOWED_CLASS_FILES[name]).read_text(), f"{name} is not in {ALLOWED_CLASS_FILES[name]}"


def test_the_detectors_fire_on_a_call_outside_the_allowed_classes_and_stay_silent_inside_them(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": list(RULES)}))
    for name in RULES:
        shutil.copyfile(CUSTOM / f"{name}.json", custom / f"{name}.json")
    shutil.copytree(CUSTOM / "skills" / "drivers-architecture", custom / "skills" / "drivers-architecture")
    (custom / "samples" / "worker_restart.py").write_text(SAMPLE)
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in RULES:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout
