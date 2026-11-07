import ast
import os
from collections import defaultdict
from pathlib import Path
from tests.unit.source_tree import source_tree

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
SKIPPED_FOLDERS = {"node_modules", "__pycache__", "dist", ".vite"}
# old migrations and the moves of version 4 rows never change, so each keeps its own copies on purpose
KEPT_COPIES = ("migrations", "upgrade")


def is_kept_copy(path: Path) -> bool:
    return any(folder in path.parts for folder in KEPT_COPIES) or "version_four" in path.name


def source_files() -> list[Path]:
    files: list[Path] = []
    for folder, subfolders, names in os.walk(SOURCE):
        subfolders[:] = [name for name in subfolders if name not in SKIPPED_FOLDERS]
        files += [Path(folder) / name for name in names if name.endswith(".py")]
    return sorted(files)


def literal_constants(path: Path) -> list[tuple[str, str]]:
    constants: list[tuple[str, str]] = []
    for node in source_tree(path).body:
        targets = node.targets if isinstance(node, ast.Assign) else [node.target] if isinstance(node, ast.AnnAssign) and node.value is not None else []
        for target in targets:
            if isinstance(target, ast.Name) and target.id.isupper() and isinstance(node, (ast.Assign, ast.AnnAssign)) and node.value is not None:
                try:
                    constants.append((target.id, repr(ast.literal_eval(node.value))))
                except ValueError:
                    continue
    return constants


def test_a_constant_with_a_literal_value_is_defined_in_one_file():
    defined: dict[tuple[str, str], list[str]] = defaultdict(list)
    for path in source_files():
        if not is_kept_copy(path):
            for constant in literal_constants(path):
                defined[constant].append(str(path.relative_to(ROOT)))
    twice = [f"{name} = {value} in {', '.join(files)}" for (name, value), files in sorted(defined.items()) if len(set(files)) > 1]
    assert twice == [], "define each once where it belongs and import it:\n" + "\n".join(twice)
