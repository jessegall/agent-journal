import ast
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
UNIT_TESTS = ROOT / "tests" / "unit"
HELPER_FOLDERS = {"support", "samples", "fixtures", "testdata"}
SKIPPED_FOLDERS = {"node_modules", "__pycache__", "dist"}
MIGRATION_FILE = re.compile(r"^m\d{3}_")


def snake(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def source_files() -> list[Path]:
    return sorted(path for path in SOURCE.rglob("*.py") if not SKIPPED_FOLDERS & set(path.parts))


def top_classes(path: Path) -> list[ast.ClassDef]:
    return [node for node in ast.parse(path.read_text()).body if isinstance(node, ast.ClassDef)]


def base_names(node: ast.ClassDef) -> list[str]:
    return [base.id if isinstance(base, ast.Name) else base.attr for base in node.bases if isinstance(base, (ast.Name, ast.Attribute))]


def test_class_file_names():
    wrong = [f"{path.relative_to(ROOT)} holds {classes[0].name}" for path in source_files() if path.name != "__init__.py" and not MIGRATION_FILE.match(path.name)
             for classes in [top_classes(path)] if len(classes) == 1 and snake(classes[0].name) != path.stem]
    assert wrong == [], f"these files are not named for their one class: {wrong}"


def test_module_file_names():
    wrong = [f"{path.relative_to(ROOT)} holds {node.name}" for path in source_files() for node in top_classes(path) if "Module" in base_names(node) and snake(node.name) != path.stem]
    assert wrong == [], f"these module files are not named for their module class: {wrong}"


def test_exception_names():
    classes = {node.name: (path, base_names(node)) for path in source_files() for node in top_classes(path)}
    exceptions = {"Exception"}
    extended = True
    while extended:
        children = {name for name, (_, bases) in classes.items() if name not in exceptions and exceptions & set(bases)}
        extended = bool(children)
        exceptions |= children
    wrong = sorted(f"{classes[name][0].relative_to(ROOT)}: {name}" for name in exceptions if name in classes and not name.endswith(("Error", "Refusal")))
    assert wrong == [], f"these exception classes do not end in Error: {wrong}"


def test_source_packages():
    folders = {path.parent for path in source_files()}
    missing = sorted(str(folder.relative_to(ROOT)) for folder in folders if not (folder / "__init__.py").exists())
    assert missing == [], f"these source folders hold Python but no __init__.py: {missing}"


def test_server_hook_folder():
    loose = sorted(str(path.relative_to(ROOT)) for path in (SOURCE / "server").glob("hook_*.py"))
    assert loose == [], f"these hook files sit in the server's top folder: {loose}"


def test_base_block_folders():
    base = SOURCE / "core" / "base"
    folders = {folder.name for folder in base.iterdir() if folder.is_dir() and folder.name != "__pycache__"}
    misplaced = [f"{path.relative_to(ROOT)} holds {classes[0].name}" for path in sorted(base.glob("*.py")) if path.name != "__init__.py"
                 for classes in [top_classes(path)] if classes and folders & set(snake(classes[0].name).split("_")[:1])]
    assert misplaced == [], f"these base files belong in the folder of their block: {misplaced}"


def test_helper_folder_tests():
    tests = sorted(str(path.relative_to(ROOT)) for path in (ROOT / "tests").rglob("test_*.py") if HELPER_FOLDERS & set(path.relative_to(ROOT).parts))
    assert tests == [], f"these tests sit in a helper folder, where pytest should not have to look: {tests}"


def test_script_test_folder():
    wrong = [f"{path.relative_to(ROOT)}" for path in sorted(UNIT_TESTS.rglob("test_*.py")) if path.relative_to(UNIT_TESTS).parts[0] != "scripts"
             and "scripts" in {name.split(".")[0] for node in ast.walk(ast.parse(path.read_text())) for name in imported_modules(node)}]
    assert wrong == [], f"these tests are of code in scripts, and belong under tests/unit/scripts: {wrong}"


def imported_modules(node: ast.AST) -> list[str]:
    if isinstance(node, ast.Import):
        return [alias.name for alias in node.names]
    return [node.module] if isinstance(node, ast.ImportFrom) and node.module and node.level == 0 else []
