from pathlib import Path

from tests.unit.support.commandments_config import commandments_config

ROOT = Path(__file__).resolve().parents[2]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
WORD_LIST_FILE = "lists"


def test_every_custom_rule_file_is_enrolled_in_the_config():
    registered = set(commandments_config(ROOT)["detectors"])
    rule_files = {path.stem for path in CUSTOM_FOLDER.glob("*.json")} - {WORD_LIST_FILE}
    assert sorted(rule_files - registered) == []
