import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
SAMPLES = CUSTOM / "samples"
REPLACED_DETECTOR = "architecture_processes_reader_judged_outside_one_place"
# the detectors of plan 1118; tests/unit/test_architecture_detectors.py already checks that every architecture
# detector loads, is enrolled, has its samples and names folders that exist, so this file adds what it lacks
DETECTORS = (
    "architecture_processes_reading_judged_outside_the_decider",
    "architecture_processes_output_measured_outside_output_facts",
    "architecture_processes_pressure_outside_the_enforcer",
    "architecture_processes_reading_nudge_outside_the_notices",
    "architecture_processes_nudge_carries_row_data",
    "architecture_processes_main_only_rule_without_reason",
    "architecture_processes_run_shown_by_category_outside_run_visibility",
    "architecture_processes_reader_chosen_outside_reader_layers",
    "architecture_processes_unreadable_mark_outside_unreadable_marks",
    "architecture_processes_stock_reader_outside_the_stock_file",
)


def commandments_binary() -> str | None:
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    return next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)


def test_the_replaced_detector_is_gone_with_its_samples():
    assert not (CUSTOM / f"{REPLACED_DETECTOR}.json").exists()
    assert REPLACED_DETECTOR not in "\n".join(path.read_text() for path in SAMPLES.rglob("*.py"))


@pytest.mark.parametrize("name", DETECTORS)
def test_the_detector_fires_on_its_bad_sample_and_leaves_its_good_one(tmp_path, name):
    executable = commandments_binary()
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    custom = tmp_path / ".commandments" / "custom"
    custom.mkdir(parents=True)
    shutil.copy(CUSTOM / f"{name}.json", custom / f"{name}.json")
    shutil.copytree(CUSTOM / "skills", custom / "skills")
    shutil.copy(ROOT / ".commandments" / "rule.schema.json", tmp_path / ".commandments" / "rule.schema.json")
    shutil.copy(CUSTOM / "lists.json", custom / "lists.json")
    for sample in SAMPLES.rglob("*.py"):
        if f" {name}\n" in sample.read_text():
            target = custom / "samples" / sample.relative_to(SAMPLES)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(sample, target)
    (tmp_path / ".commandments" / "config.json").write_text(json.dumps({"detectors": [name]}))
    completed = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=120)
    assert f"✓ {name}" in completed.stdout, completed.stdout + completed.stderr
