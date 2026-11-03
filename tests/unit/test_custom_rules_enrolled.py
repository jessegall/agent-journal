import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
WORD_LIST_FILE = "lists"
# task 5897 enrols this one once it is calibrated
UNCALIBRATED_RULE = "listener_repeats_a_decision"


def test_every_custom_rule_file_is_enrolled_in_the_config():
    enrolled = set(json.loads((ROOT / ".commandments" / "config.json").read_text())["detectors"])
    rule_files = {path.stem for path in CUSTOM_FOLDER.glob("*.json")} - {WORD_LIST_FILE, UNCALIBRATED_RULE}
    assert sorted(rule_files - enrolled) == []
