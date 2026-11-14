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


def test_336_core_base_is_removed_and_the_engine_holds_only_folders_and_its_package_file():
    engine_loose_files = sorted(path.name for path in (SOURCE_FOLDER / "engine").iterdir() if path.is_file())
    assert not PREVIOUS_FOLDER.exists(), str(engine_loose_files)
    assert engine_loose_files == ['__init__.py'], str(engine_loose_files)


def test_356_the_helper_type_folder_holds_the_helper_type_and_its_parts_and_no_file_declares_them_a_second_time():
    folder_files = sorted(path.name for path in HELPER_TYPE_FOLDER.iterdir() if path.is_file())
    declared = {name: files_declaring(class_line) for name, class_line in HELPER_TYPE_CLASSES.items()}
    assert folder_files == ['__init__.py', 'command_allow_list.py', 'helper_behaviours.py', 'helper_type.py', 'helper_type_area.py', 'helper_type_book.py', 'helper_type_entry.py', 'journal_line.py', 'main_agent.py'], str(folder_files)
    assert all((files == [f'src/engine/helper_type/{name}'] for name, files in declared.items())), str(declared)
    assert not list(SOURCE_FOLDER.rglob('core/base/helper_type*'))
    assert not list(SOURCE_FOLDER.rglob('core/base/agent_type*'))
