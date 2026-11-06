import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
WORD_LIST_FILE = "lists"


def test_every_custom_rule_file_is_enrolled_in_the_config():
    registered = set(json.loads((ROOT / ".commandments" / "config.json").read_text())["detectors"])
    rule_files = {path.stem for path in CUSTOM_FOLDER.glob("*.json")} - {WORD_LIST_FILE}
    assert sorted(rule_files - registered) == []
