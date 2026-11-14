import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULE = "core_names_no_coding_word"
SKILL = "core-names-no-suite"
SAMPLES = Path("samples") / "coding-words"
PATTERN_START = re.compile(r"^\(\^\|/\)")
PATTERN_CHARACTER = re.compile(r"[\[\](){}*+?\\^$|]")


def declared() -> dict:
    return json.loads((CUSTOM / f"{RULE}.json").read_text())


def allowed_paths() -> list[str]:
    patterns = [step["fileMatches"] for step in declared()["find"]["reject"]]
    literals = []
    for pattern in patterns:
        text = PATTERN_START.sub("", pattern).replace("\\.", ".")
        match = PATTERN_CHARACTER.search(text)
        literals.append((text if match is None else text[:match.start()]).rstrip("/"))
    return literals


def test_the_detector_exists_is_listed_and_names_its_skill():
    rule = declared()
    assert rule["engine"] == "python" and rule["find"]["select"] == "kind:Module"
    assert RULE in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert (CUSTOM / "skills" / rule["sin"]["skill"] / "SKILL.md").is_file()


def test_every_path_the_detector_leaves_out_exists_and_its_skill_names_it():
    skill = (CUSTOM / "skills" / SKILL / "SKILL.md").read_text()
    for path in allowed_paths():
        assert (ROOT / path).exists(), f"{path} is left out by {RULE} but does not exist"
        assert Path(path).name in skill or path.split("/")[-1] in skill, f"the skill {SKILL} gives no reason for {path}"


def test_the_detector_fires_on_a_coding_word_and_stays_silent_on_core_words(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    custom.mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [RULE]}))
    shutil.copyfile(CUSTOM / f"{RULE}.json", custom / f"{RULE}.json")
    shutil.copytree(CUSTOM / "skills" / SKILL, custom / "skills" / SKILL)
    shutil.copytree(CUSTOM / SAMPLES, custom / SAMPLES)
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    assert f"✓ {RULE}" in completed_process.stdout, completed_process.stdout
