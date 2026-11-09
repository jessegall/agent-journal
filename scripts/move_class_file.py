"""Moves one Python file to another path and rewrites every import of it in the same pass."""

import argparse
import ast
import re
import shutil
import sys
from collections.abc import Iterator
from pathlib import Path

SOURCE_FOLDERS = ("src", "tests", "scripts")
SKIPPED_FOLDERS = {"__pycache__", "node_modules"}


class MoveRefused(Exception):
    """A move that cannot be made safely; the message names the reason and every reference it cannot rewrite."""


def module_name(root: Path, path: Path) -> str:
    parts = path.relative_to(root).with_suffix("").parts
    return ".".join(parts[1:] if parts[0] == "src" else parts)


def python_files(root: Path) -> Iterator[Path]:
    for folder in SOURCE_FOLDERS:
        for path in sorted((root / folder).rglob("*.py")):
            if not SKIPPED_FOLDERS.intersection(path.relative_to(root).parts):
                yield path


def replaced_lines(text: str, edits: list[tuple[int, int, int, str]]) -> str:
    lines = text.split("\n")
    for line_number, start, end, replacement in sorted(edits, reverse=True):
        encoded = lines[line_number - 1].encode()
        lines[line_number - 1] = (encoded[:start] + replacement.encode() + encoded[end:]).decode()
    return "\n".join(lines)


def module_token_edit(line: str, line_number: int, module: str, replacement: str) -> tuple[int, int, int, str] | None:
    match = re.search(rf"\bfrom\s+({re.escape(module)})\s+import\b", line)
    if match is None:
        return None
    start = len(line[: match.start(1)].encode())
    return line_number, start, start + len(module.encode()), replacement


def text_nodes_outside_docstrings(tree: ast.Module) -> Iterator[ast.Constant]:
    skipped: set[int] = set()
    for node in ast.walk(tree):
        if isinstance(node, (ast.Module, ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)) and node.body and isinstance(node.body[0], ast.Expr):
            skipped.add(id(node.body[0].value))
        if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == "__all__" for target in node.targets):
            skipped.update(id(item) for item in ast.walk(node.value))
    for node in ast.walk(tree):
        if isinstance(node, ast.Constant) and isinstance(node.value, str) and id(node) not in skipped:
            yield node


def attribute_text(node: ast.expr) -> str | None:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        owner = attribute_text(node.value)
        return None if owner is None else f"{owner}.{node.attr}"
    return None


def relative_import_target(file_module: str, is_package: bool, node: ast.ImportFrom) -> str:
    package = file_module.split(".") if is_package else file_module.split(".")[:-1]
    base = package[: len(package) - node.level + 1]
    return ".".join([*base, *([node.module] if node.module else [])])


def import_edits(path: Path, label: str, file_module: str, previous: str, moved: str) -> tuple[list[tuple[int, int, int, str]], list[str], set[int]]:
    text = path.read_text()
    tree = ast.parse(text)
    lines = text.split("\n")
    previous_package, _, previous_stem = previous.rpartition(".")
    moved_package, _, moved_stem = moved.rpartition(".")
    edits: list[tuple[int, int, int, str]] = []
    unplaced: list[str] = []
    import_lines: set[int] = set()
    names_full_path = False
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            import_lines.update(range(node.lineno, (node.end_lineno or node.lineno) + 1))
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name != previous:
                    continue
                start = alias.col_offset
                edits.append((alias.lineno, start, start + len(previous.encode()), moved))
                names_full_path = names_full_path or alias.asname is None
        if isinstance(node, ast.ImportFrom) and node.level:
            target = relative_import_target(file_module, path.name == "__init__.py", node)
            if target == previous or (target == previous_package and any(alias.name == previous_stem for alias in node.names)):
                unplaced.append(f"{label}:{node.lineno}: a relative import of the file")
        if isinstance(node, ast.ImportFrom) and not node.level and node.module == previous:
            edit = module_token_edit(lines[node.lineno - 1], node.lineno, previous, moved)
            if edit is None:
                unplaced.append(f"{label}:{node.lineno}: an import written in a form the tool cannot read")
            else:
                edits.append(edit)
        if isinstance(node, ast.ImportFrom) and not node.level and node.module == previous_package and any(alias.name == previous_stem for alias in node.names):
            edit = module_token_edit(lines[node.lineno - 1], node.lineno, previous_package, moved_package)
            if len(node.names) > 1 or previous_stem != moved_stem or edit is None:
                unplaced.append(f"{label}:{node.lineno}: imports the file by name from its package together with other names or under a changed name")
            else:
                edits.append(edit)
    if names_full_path:
        for node in ast.walk(tree):
            if isinstance(node, ast.Attribute) and attribute_text(node) == previous:
                edits.append((node.lineno, node.col_offset, node.end_col_offset or node.col_offset, moved))
    pattern = re.compile(rf"(?<![\w.]){re.escape(previous)}(?!\w)")
    unplaced.extend(f"{label}:{node.lineno}: names the file in a string" for node in text_nodes_outside_docstrings(tree) if pattern.search(node.value))
    return edits, unplaced, import_lines


def planned_files(root: Path, source: Path, target: Path) -> dict[Path, str]:
    if not source.is_file():
        raise MoveRefused(f"{source.relative_to(root)} is not a file")
    if target.exists():
        raise MoveRefused(f"{target.relative_to(root)} exists already")
    previous, moved = module_name(root, source), module_name(root, target)
    changed: dict[Path, str] = {}
    unplaced: list[str] = []
    for path in python_files(root):
        label = path.relative_to(root).as_posix()
        edits, file_unplaced, import_lines = import_edits(path, label, module_name(root, path), previous, moved)
        unplaced.extend(file_unplaced)
        if path == source and any(edit[0] not in import_lines for edit in edits):
            raise MoveRefused(f"{label}: the move would change a line of the moved file that is not an import")
        if edits:
            changed[path] = replaced_lines(path.read_text(), edits)
    if unplaced:
        raise MoveRefused("references the tool cannot rewrite:\n" + "\n".join(unplaced))
    return changed


def missing_package_files(root: Path, target: Path) -> list[Path]:
    folders = [folder for folder in target.parents if root in folder.parents and folder != root / target.relative_to(root).parts[0]]
    return [folder / "__init__.py" for folder in reversed(folders) if not (folder / "__init__.py").exists()]


def move_file(root: Path, source: Path, target: Path, leave_alias: bool = False, dry_run: bool = False) -> list[str]:
    if leave_alias:
        raise MoveRefused(f"{source.relative_to(root)}: a move leaves no alias at the old path")
    changed = planned_files(root, source, target)
    report = [f"change {path.relative_to(root).as_posix()}" for path in changed]
    if dry_run:
        return report
    for path, text in changed.items():
        path.write_text(text)
    target.parent.mkdir(parents=True, exist_ok=True)
    for package_file in missing_package_files(root, target):
        package_file.write_text("")
    shutil.move(source, target)
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source")
    parser.add_argument("target")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--leave-alias", action="store_true")
    arguments = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    try:
        report = move_file(root, root / arguments.source, root / arguments.target, arguments.leave_alias, arguments.dry_run)
    except MoveRefused as refusal:
        print(f"refused: {refusal}", file=sys.stderr)
        return 1
    print("\n".join(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
