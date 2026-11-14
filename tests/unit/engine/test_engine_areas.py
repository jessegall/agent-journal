import re
from pathlib import Path

ENGINE = Path(__file__).resolve().parents[3] / "src" / "engine"
USE = re.compile(r"use = AreaUse\.(CONTRACT|INTERNAL)\b")


def test_every_engine_folder_is_marked_contract_or_internal_once():
    folders = [folder for folder in ENGINE.iterdir() if folder.is_dir() and folder.name != "__pycache__"]
    unmarked = [folder.name for folder in folders if len([USE.search(marker.read_text()) for marker in folder.glob("*_area.py") if USE.search(marker.read_text())]) != 1]
    assert not unmarked, f"these engine areas need exactly one marker that says contract or internal: {unmarked}"
