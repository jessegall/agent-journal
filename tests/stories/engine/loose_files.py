from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SOURCE_FOLDER = ROOT / "src"
PREVIOUS_FOLDER = SOURCE_FOLDER / "core" / "base"
HELPER_TYPE_FOLDER = SOURCE_FOLDER / "engine" / "helper_type"
HELPER_TYPE_CLASSES = {"helper_type.py": "class HelperType:", "helper_type_book.py": "class HelperTypeBook:"}


def python_files(folder: Path) -> list[Path]:
    return sorted(path for path in folder.rglob("*.py") if "__pycache__" not in path.parts)


def files_declaring(class_line: str) -> list[str]:
    return [str(path.relative_to(ROOT)) for path in python_files(SOURCE_FOLDER) if any(line.startswith(class_line) for line in path.read_text().splitlines())]


def test_336_core_base_is_removed_and_the_engine_holds_only_folders_and_its_package_file(new_story):
    story = new_story()
    engine_loose_files = sorted(path.name for path in (SOURCE_FOLDER / "engine").iterdir() if path.is_file())
    story.expect_rows(not PREVIOUS_FOLDER.exists(), engine_loose_files == ["__init__.py"], detail=str(engine_loose_files))


def test_356_the_helper_type_folder_holds_its_two_classes_and_no_file_declares_them_a_second_time(new_story):
    story = new_story()
    folder_files = sorted(path.name for path in HELPER_TYPE_FOLDER.iterdir() if path.is_file())
    declared = {name: files_declaring(class_line) for name, class_line in HELPER_TYPE_CLASSES.items()}
    story.expect_rows(folder_files == ["__init__.py", "helper_type.py", "helper_type_area.py", "helper_type_book.py", "helper_type_entry.py"], detail=str(folder_files))
    story.expect_rows(all(files == [f"src/engine/helper_type/{name}"] for name, files in declared.items()), detail=str(declared))
    story.expect_rows(not list(SOURCE_FOLDER.rglob("core/base/helper_type*")), not list(SOURCE_FOLDER.rglob("core/base/agent_type*")))
