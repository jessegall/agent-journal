import ast
import tempfile
from pathlib import Path

from mypy import api

PROJECT = Path(__file__).resolve().parents[4]
SOURCE = PROJECT / "src"
FILE_ACCESS = SOURCE / "engine" / "file" / "file_access.py"
PLUGIN = Path(__file__).resolve().parent / "support" / "file_access_plugin.py"
CACHE = Path(tempfile.gettempdir()) / "journal-file-access-check"
BYPASS = "file-access-bypass"
PATH_ONLY_METHODS = frozenset({
    "is_dir", "is_file", "is_symlink", "mkdir", "rglob", "iterdir", "unlink", "rmdir", "symlink_to", "readlink", "read_text",
    "read_bytes", "write_text", "write_bytes", "touch", "lstat", "samefile", "hardlink_to",
})
MODULE_FUNCTIONS = frozenset({
    "open", "io.open", "shutil.rmtree", "shutil.move", "shutil.copy", "shutil.copy2", "shutil.copyfile", "shutil.copytree",
    "shutil.copymode", "shutil.copystat", "os.walk", "os.fwalk", "os.listdir", "os.scandir", "os.remove", "os.unlink",
    "os.rename", "os.renames", "os.replace", "os.makedirs", "os.mkdir", "os.rmdir", "os.removedirs", "os.stat", "os.lstat",
    "os.open", "os.chmod", "os.symlink", "os.link", "os.readlink", "os.truncate", "os.utime", "os.path.exists",
    "os.path.isfile", "os.path.isdir", "os.path.islink", "os.path.lexists", "os.path.getsize", "os.path.getmtime",
    "glob.glob", "glob.iglob", "tempfile.NamedTemporaryFile", "tempfile.TemporaryFile", "tempfile.mkstemp",
    "tempfile.mkdtemp", "tempfile.TemporaryDirectory",
})
CONFIG = f"""[mypy]
mypy_path = {SOURCE}
plugins = {PLUGIN}
ignore_missing_imports = True
follow_imports = silent
check_untyped_defs = True
show_column_numbers = True
no_error_summary = True
cache_dir = {CACHE}
"""


def typed_bypasses(config: Path) -> list[str]:
    output, errors, _ = api.run(["--config-file", str(config), str(SOURCE)])
    return [line for line in (output + errors).splitlines() if BYPASS in line]


def dotted_name(node: ast.expr) -> str:
    if isinstance(node, ast.Name):
        return node.id
    return f"{dotted_name(node.value)}.{node.attr}" if isinstance(node, ast.Attribute) else ""


def is_path_only_call(node: ast.AST) -> bool:
    if not isinstance(node, ast.Call):
        return False
    if dotted_name(node.func) in MODULE_FUNCTIONS:
        return True
    return (isinstance(node.func, ast.Attribute) and node.func.attr in PATH_ONLY_METHODS
            and not (isinstance(node.func.value, ast.Name) and node.func.value.id == "FileAccess"))


# a call the type checker cannot see, such as one on an untyped receiver or through a callable object like
# shutil.rmtree, is still caught by its name
def untyped_bypasses() -> list[str]:
    return [f"{file.relative_to(PROJECT)}:{node.lineno}" for file in sorted(SOURCE.rglob("*.py")) if file != FILE_ACCESS
            for node in ast.walk(ast.parse(file.read_text(), str(file))) if is_path_only_call(node)]


def test_no_code_outside_file_access_reaches_the_file_system(tmp_path: Path):
    config = tmp_path / "mypy.ini"
    config.write_text(CONFIG)
    bypasses = typed_bypasses(config) + untyped_bypasses()
    assert not bypasses, f"{len(bypasses)} file system calls bypass FileAccess:\n" + "\n".join(bypasses)
