import re
import subprocess
from pathlib import Path

from engine.module.module_finder import DEFAULT_MODULE_LISTS

ROOT = Path(__file__).resolve().parents[3]
PREVIOUS_FOLDERS = ("src/core/base", "tests/unit/core/base", "tests/stories/core/base")
PREVIOUS_NAME = re.compile(r"core[./]base\b")
SEARCHED = ("src", "tests", "scripts", "docs", "pyrightconfig.json", ".commandments", "install.sh", "deploy")
STORIES_OF_THE_MOVES = {
    "tests/stories/engine/areas_moved.py", "tests/stories/engine/loose_files.py", "tests/stories/engine/errors/errors_moved.py",
    "tests/stories/engine/engine_closed.py",
}
SCREEN_DESIGNS_WITH_SAMPLE_LOG_LINES = "docs/designs/"


def tracked_files() -> list[str]:
    listed = subprocess.run(["git", "ls-files", *SEARCHED], capture_output=True, text=True, cwd=ROOT, check=True).stdout.splitlines()
    return [name for name in listed if name not in STORIES_OF_THE_MOVES and not name.startswith(SCREEN_DESIGNS_WITH_SAMPLE_LOG_LINES)]


def files_naming_core_base() -> list[str]:
    naming = []
    for name in tracked_files():
        path = ROOT / name
        if path.is_file() and PREVIOUS_NAME.search(path.read_text(errors="ignore")):
            naming.append(name)
    return naming


def test_418_core_base_is_gone_and_no_file_names_it(new_story):
    story = new_story()
    remaining = [folder for folder in PREVIOUS_FOLDERS if (ROOT / folder).exists()]
    naming = files_naming_core_base()
    module_lists = [path.text for path in DEFAULT_MODULE_LISTS]
    layer_table = (ROOT / "src/engine/module/layer_table.py").read_text()
    story.expect_rows(remaining == [], naming == [], detail=f"remaining {remaining}, naming {naming[:20]}")
    story.expect_rows(not any("base" in path for path in module_lists), 'r"src/engine/"' in layer_table, detail=str(module_lists))
