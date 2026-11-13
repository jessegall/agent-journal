import re
from pathlib import Path

SHIPPED_FOLDERS = ("src", "tools")
SKIPPED_FOLDERS = {"node_modules", "dist", "__pycache__", "tests", "testdata"}
TEXT_ENDINGS = {".py", ".md", ".json", ".js", ".ts", ".vue", ".go", ".sh", ".css", ".html", ".toml", ".yaml", ".yml"}
PLUGIN_NAME = re.compile("commandments|journal sins", re.IGNORECASE)


def published_files() -> list[Path]:
    files = [path for folder in SHIPPED_FOLDERS for path in Path(folder).rglob("*") if path.is_file()]
    return [path for path in files if path.suffix in TEXT_ENDINGS and not path.name.endswith("_test.go") and not SKIPPED_FOLDERS.intersection(path.parts)]


def test_no_shipped_file_names_one_particular_plugin():
    matching_paths = [str(path) for path in published_files() if PLUGIN_NAME.search(path.read_text(errors="ignore"))]
    assert not matching_paths, matching_paths
