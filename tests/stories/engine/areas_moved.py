import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ENGINE_FOLDER = ROOT / "src" / "engine"
PREVIOUS_FOLDERS = (ROOT / "src" / "core" / "base", ROOT / "tests" / "unit" / "core" / "base", ROOT / "tests" / "stories" / "core" / "base")
AREAS = (
    "bookkeeping", "caller", "change", "chat", "cli", "command", "database", "dotted_path", "driver", "git", "guard", "hosting",
    "library", "listener", "model", "module", "performance", "private", "profile", "provider", "query", "registry", "repository",
    "scope", "seed", "setting", "skill", "subcommand", "tasks", "template", "ticker", "tunnel", "upgrade", "viewer",
)
PREVIOUS_NAME = re.compile(r"core[./]base[./](" + "|".join(AREAS) + r")\b")
SCANNED_FOLDERS = ("src/core", "src/engine", "src/suites", "src/server", "src/install", "src/tunnels", "tests", "scripts")
STORIES_OF_THE_MOVES = {"tests/stories/engine/areas_moved.py", "tests/stories/engine/loose_files.py", "tests/stories/engine/errors/errors_moved.py"}


def python_files(folder: Path) -> list[Path]:
    return sorted(path for path in folder.rglob("*.py") if "__pycache__" not in path.parts and "node_modules" not in path.parts)


def files_naming_a_previous_area() -> list[str]:
    matching = []
    for folder in SCANNED_FOLDERS:
        for path in python_files(ROOT / folder):
            relative = str(path.relative_to(ROOT))
            if relative not in STORIES_OF_THE_MOVES and PREVIOUS_NAME.search(path.read_text()):
                matching.append(relative)
    return matching


def test_337_every_area_folder_sits_in_the_engine_and_none_in_core_base(new_story):
    story = new_story()
    missing = [area for area in AREAS if not python_files(ENGINE_FOLDER / area)]
    remaining = [str(folder.relative_to(ROOT) / area) for folder in PREVIOUS_FOLDERS for area in AREAS if (folder / area).exists()]
    story.expect_rows(missing == [], remaining == [], detail=f"missing {missing}, remaining {remaining}")


def test_338_the_test_folders_of_each_moved_area_sit_under_the_engine_test_folders(new_story):
    story = new_story()
    unit_areas = {folder.name for folder in (ROOT / "tests" / "unit" / "engine").iterdir() if folder.is_dir()}
    story_areas = {folder.name for folder in (ROOT / "tests" / "stories" / "engine").iterdir() if folder.is_dir()}
    unknown = sorted((unit_areas | story_areas) - {folder.name for folder in ENGINE_FOLDER.iterdir()} - {"__pycache__", "samples", "support"})
    story.expect_rows(unknown == [], detail=str(unknown))


def test_no_source_or_test_file_names_a_moved_area_by_its_previous_path(new_story):
    story = new_story()
    matching = files_naming_a_previous_area()
    story.expect_rows(matching == [], detail=str(matching[:20]))
