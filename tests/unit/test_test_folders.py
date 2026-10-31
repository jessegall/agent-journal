from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
TEST_ROOTS = [ROOT / "tests" / "unit", ROOT / "tests" / "stories"]
SCRIPTS_FOLDER = "scripts"
HELPER_FOLDERS = {"support", "samples", "fixtures", "testdata", "web", "__pycache__"}


def test_every_test_folder_has_the_same_path_under_src():
    folders = [(root, folder.relative_to(root)) for root in TEST_ROOTS for folder in root.rglob("*") if folder.is_dir()]
    unmatched = [str(root.relative_to(ROOT) / path) for root, path in folders if not HELPER_FOLDERS & set(path.parts) and not (SOURCE / path).is_dir() and path.parts[0] != SCRIPTS_FOLDER]
    assert unmatched == [], f"these test folders have no folder of the same path under src: {unmatched}"


def test_every_test_folder_holding_python_is_a_package():
    folders = {path.parent for path in (ROOT / "tests").rglob("*.py") if "__pycache__" not in path.parts}
    packages = {folder for path in folders for folder in [path, *path.parents] if folder.is_relative_to(ROOT / "tests")}
    missing = sorted(str(folder.relative_to(ROOT)) for folder in packages if not (folder / "__init__.py").exists())
    assert missing == [], f"these test folders hold Python but no __init__.py: {missing}"
