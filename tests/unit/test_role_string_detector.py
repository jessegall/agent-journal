import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULE = "architecture_agents_role_key_compared_as_text"
SKILL = "plain-code-words"
SAMPLES = Path("samples") / "roles"
PLUGIN = Path(".journal/plugins/code-commandments/bin/commandments-release")


def test_the_detector_names_its_skill_and_leaves_out_only_the_type_classes_and_migrations():
    rule = json.loads((CUSTOM / f"{RULE}.json").read_text())
    assert rule["engine"] == "python" and rule["find"]["select"] == "comparison"
    assert (CUSTOM / "skills" / rule["sin"]["skill"] / "SKILL.md").is_file()
    assert [step["fileMatches"] for step in rule["find"]["reject"] if "fileMatches" in step] == ["(^|/)(helper_type|types)/", "(^|/)migrations/", "(^|/)engine/testing/"]


def test_a_role_compared_as_text_is_refused_and_a_comparison_by_class_or_by_field_name_is_not(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    custom.mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [RULE]}))
    shutil.copyfile(CUSTOM / f"{RULE}.json", custom / f"{RULE}.json")
    shutil.copytree(CUSTOM / "skills" / SKILL, custom / "skills" / SKILL)
    shutil.copytree(CUSTOM / SAMPLES, custom / SAMPLES)
    executable = next((str(folder / PLUGIN) for folder in (ROOT, *ROOT.parents) if (folder / PLUGIN).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    assert f"✓ {RULE}" in completed_process.stdout, completed_process.stdout
