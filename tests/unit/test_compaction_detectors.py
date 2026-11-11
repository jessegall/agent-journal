import json
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULES = (
    "architecture_compactions_row_built_outside_the_compactions",
    "architecture_compactions_notice_built_outside_the_notices",
    "architecture_compactions_request_recorded_outside_the_control",
)
ALLOWED_CLASS_FILES = {
    "ContextCompactions": "src/core/modules/drivers/support/context_compactions.py",
    "CompactionNotices": "src/core/modules/drivers/support/compaction_notices.py",
    "RecordedContextChangeRequests": "src/core/modules/drivers/bindings/recorded_context_change_requests.py",
}
SAMPLE = CUSTOM / "samples" / "compactions" / "idle_agent_compactor.py"


@pytest.mark.parametrize("rule", RULES)
def test_the_detector_exists_is_enrolled_and_every_class_it_allows_sits_in_its_file(rule):
    declared = json.loads((CUSTOM / f"{rule}.json").read_text())
    allowed = next(step["nameIn"] for step in declared["find"]["reject"] if "nameIn" in step)
    assert declared["engine"] == "python" and allowed
    assert rule in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert (CUSTOM / "skills" / declared["sin"]["skill"] / "SKILL.md").is_file()
    for name in allowed:
        assert f"class {name}" in (ROOT / ALLOWED_CLASS_FILES[name]).read_text(), f"{name} is not in {ALLOWED_CLASS_FILES[name]}"


def test_each_detector_fires_outside_the_allowed_class_and_stays_silent_inside_it(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": list(RULES)}))
    for name in RULES:
        shutil.copyfile(CUSTOM / f"{name}.json", custom / f"{name}.json")
    shutil.copytree(CUSTOM / "skills" / "drivers-architecture", custom / "skills" / "drivers-architecture")
    shutil.copyfile(SAMPLE, custom / "samples" / "idle_agent_compactor.py")
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=180)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in RULES:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout
