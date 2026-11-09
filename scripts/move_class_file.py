"""Moves a Python file or a whole folder to another path, with its test files, and rewrites every reference in the same pass."""

import argparse
import ast
import json
import re
import shutil
import subprocess
import sys
import tempfile
from collections.abc import Iterator, Sequence
from dataclasses import dataclass
from pathlib import Path

SOURCE_FOLDERS = ("src", "tests", "scripts")
SKIPPED_FOLDERS = {"__pycache__", "node_modules"}
TEXT_FILE_PATTERNS = (".commandments/**/*", "tests/snapshots/**/*.json", "docs/writing-a-module.md", "pyrightconfig.json", "src/**/layer_allow_list.txt")
RECORDING_FILE_PATTERNS = ["tools/journal-hook/**/testdata/*.jsonl"]
ALLOW_LISTED_RULE_PATTERN = "architecture_layout_*.json"
PLUGIN_FILE_PATTERNS =[".journal/plugins/*/journal-plugin.json"]
TEST_ROOTS = ("tests/unit", "tests/stories")
SCRIPTS_FOLDER = "scripts"
HELPER_FOLDERS = {"support", "samples", "fixtures", "testdata", "web", "__pycache__"}
ENGINE_SOURCE = "src/core/base"
ENGINE_TARGET = "src/engine"
LAYER_PATTERN_LINE = 'LayerPattern(re.compile(r"{}/"), LayerTier.ENGINE)'
LAYER_PATTERN_OLD_FOLDER = LAYER_PATTERN_LINE.format(ENGINE_SOURCE)
LAYER_PATTERN_TWO_FOLDERS = LAYER_PATTERN_LINE.format("src/(?:core/base|engine)")
LAYER_PATTERN_NEW_FOLDER = LAYER_PATTERN_LINE.format(ENGINE_TARGET)
DOTTED_SEPARATORS = ".:"
PATH_SEPARATORS = "/"
STRING_OPENING = re.compile(rb"""[rRuU]*('''|\"\"\"|'|\")""")


class MoveError(Exception):
    """A move that cannot be made safely; the message names the reason and every reference it cannot rewrite."""


@dataclass(frozen=True)
class Rename:
    """The old and new name of a moved file or folder, written as a dotted module or as a path."""

    previous: str
    moved: str
    separators: str

    @property
    def pattern(self) -> re.Pattern[str]:
        return re.compile(rf"(?<![\w.]){re.escape(self.previous)}(?!\w)")

    def applied(self, name: str) -> str | None:
        if name == self.previous or name.startswith(tuple(f"{self.previous}{separator}" for separator in self.separators)):
            return f"{self.moved}{name[len(self.previous):]}"
        return None


@dataclass(frozen=True, order=True)
class LineEdit:
    """One replaced span of one line, with the span given in bytes."""

    line_number: int
    start: int
    end: int
    replacement: str


@dataclass(frozen=True)
class MovePlan:
    """Which files a move takes where, which files and folders it clears, and which names it rewrites."""

    file_targets: dict[Path, Path]
    dropped_files: tuple[Path, ...]
    emptied_folders: tuple[Path, ...]
    renames: tuple[Rename, ...]
    guards_moved_lines: bool
    report_lines: tuple[str, ...]

    def guards_file(self, path: Path) -> bool:
        return self.guards_moved_lines and path in self.file_targets


EMPTY_PLAN = MovePlan({}, (), (), (), False, ())


def module_name(root: Path, path: Path) -> str:
    parts = path.relative_to(root).with_suffix("").parts
    return ".".join(parts[1:] if parts[0] == "src" else parts)


def relative_text(root: Path, path: Path) -> str:
    return path.relative_to(root).as_posix()


def is_skipped(root: Path, path: Path) -> bool:
    return bool(SKIPPED_FOLDERS.intersection(path.relative_to(root).parts))


def python_files(root: Path) -> Iterator[Path]:
    for folder in SOURCE_FOLDERS:
        for path in sorted((root / folder).rglob("*.py")):
            if not is_skipped(root, path):
                yield path


def folder_files(root: Path, folder: Path) -> list[Path]:
    return [path for path in sorted(folder.rglob("*")) if path.is_file() and not is_skipped(root, path)]


def replaced_lines(text: str, edits: list[LineEdit]) -> str:
    lines = text.split("\n")
    for edit in sorted(edits, reverse=True):
        encoded = lines[edit.line_number - 1].encode()
        lines[edit.line_number - 1] = (encoded[:edit.start] + edit.replacement.encode() + encoded[edit.end:]).decode()
    return "\n".join(lines)


def module_token_edit(line: str, line_number: int, module: str, replacement: str) -> LineEdit | None:
    match = re.search(rf"\bfrom\s+({re.escape(module)})\s+import\b", line)
    if match is None:
        return None
    start = len(line[: match.start(1)].encode())
    return LineEdit(line_number, start, start + len(module.encode()), replacement)


def plain_string_nodes(tree: ast.Module) -> Iterator[ast.Constant]:
    skipped: set[int] = set()
    for node in ast.walk(tree):
        if isinstance(node, (ast.Module, ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)) and node.body and isinstance(node.body[0], ast.Expr):
            skipped.add(id(node.body[0].value))
        if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == "__all__" for target in node.targets):
            skipped.update(id(item) for item in ast.walk(node.value))
    for node in ast.walk(tree):
        if isinstance(node, ast.Constant) and isinstance(node.value, str) and id(node) not in skipped:
            yield node


def string_edit(line: str, node: ast.Constant, rename: Rename) -> LineEdit | None:
    encoded = line.encode()
    previous = rename.previous.encode()
    opening = STRING_OPENING.match(encoded, node.col_offset)
    if rename.applied(node.value) is None or opening is None or encoded[opening.end(): opening.end() + len(previous)] != previous:
        return None
    return LineEdit(node.lineno, opening.end(), opening.end() + len(previous), rename.moved)


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
    if node.module:
        base.append(node.module)
    return ".".join(base)


def rewritten_name(renames: Sequence[Rename], name: str) -> str | None:
    return next((moved for rename in renames if (moved := rename.applied(name)) is not None), None)


class FileRewrite:
    """The edits one Python file needs for a move, and the references in it the tool cannot rewrite."""

    def __init__(self, path: Path, label: str, file_module: str, renames: Sequence[Rename]) -> None:
        self.path = path
        self.label = label
        self.file_module = file_module
        self.renames = renames
        self.text = path.read_text()
        self.lines = self.text.split("\n")
        self.edits: list[LineEdit] = []
        self.unplaced: list[str] = []
        self.import_lines: set[int] = set()
        self.full_paths: dict[str, str] = {}
        self.collect(ast.parse(self.text))

    def collect(self, tree: ast.Module) -> None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                self.import_lines.update(range(node.lineno, (node.end_lineno or node.lineno) + 1))
            if isinstance(node, ast.Import):
                self.add_plain_import(node)
            if isinstance(node, ast.ImportFrom):
                self.add_module_import(node)
        if self.full_paths:
            self.add_full_path_uses(tree)
        for node in plain_string_nodes(tree):
            self.add_string(node)

    def add_plain_import(self, node: ast.Import) -> None:
        for alias in node.names:
            moved = rewritten_name(self.renames, alias.name)
            if moved is None:
                continue
            self.edits.append(LineEdit(alias.lineno, alias.col_offset, alias.col_offset + len(alias.name.encode()), moved))
            if alias.asname is None:
                self.full_paths[alias.name] = moved

    def add_module_import(self, node: ast.ImportFrom) -> None:
        if node.level:
            self.add_relative_import(node)
            return
        module = node.module or ""
        moved_module = rewritten_name(self.renames, module)
        if moved_module is not None:
            self.add_module_token(node, module, moved_module)
            return
        for alias in node.names:
            self.add_package_member_import(node, module, alias)

    def add_package_member_import(self, node: ast.ImportFrom, module: str, alias: ast.alias) -> None:
        moved_file = rewritten_name(self.renames, f"{module}.{alias.name}")
        if moved_file is None:
            return
        moved_package, _, moved_stem = moved_file.rpartition(".")
        if len(node.names) > 1 or alias.name != moved_stem:
            self.unplaced.append(f"{self.label}:{node.lineno}: imports the file by name from its package together with other names or under a changed name")
            return
        self.add_module_token(node, module, moved_package)

    def add_module_token(self, node: ast.ImportFrom, module: str, moved: str) -> None:
        edit = module_token_edit(self.lines[node.lineno - 1], node.lineno, module, moved)
        if edit is None:
            self.unplaced.append(f"{self.label}:{node.lineno}: an import written in a form the tool cannot read")
            return
        self.edits.append(edit)

    def add_relative_import(self, node: ast.ImportFrom) -> None:
        target = relative_import_target(self.file_module, self.path.name == "__init__.py", node)
        reached = [self.file_module, target, *(f"{target}.{alias.name}" for alias in node.names)]
        if any(rewritten_name(self.renames, name) is not None for name in reached):
            self.unplaced.append(f"{self.label}:{node.lineno}: a relative import of the file")

    def add_full_path_uses(self, tree: ast.Module) -> None:
        for node in ast.walk(tree):
            if not isinstance(node, ast.Attribute):
                continue
            full_path = attribute_text(node)
            if full_path in self.full_paths:
                self.edits.append(LineEdit(node.lineno, node.col_offset, node.end_col_offset or node.col_offset, self.full_paths[full_path]))

    def add_string(self, node: ast.Constant) -> None:
        for rename in self.renames:
            if rename.pattern.search(node.value) is None:
                continue
            edit = string_edit(self.lines[node.lineno - 1], node, rename)
            if edit is None:
                self.unplaced.append(f"{self.label}:{node.lineno}: names the file in a string the tool cannot rewrite")
                continue
            self.edits.append(edit)

    @property
    def has_edits_outside_imports(self) -> bool:
        return any(edit.line_number not in self.import_lines for edit in self.edits)

    def edited_text(self) -> str:
        return replaced_lines(self.text, self.edits)


def files_matching(root: Path, patterns: Sequence[str]) -> Iterator[Path]:
    for pattern in patterns:
        yield from (path for path in sorted(root.glob(pattern)) if path.is_file())


def file_text(path: Path) -> str | None:
    try:
        return path.read_text()
    except UnicodeDecodeError:
        return None


def rewritten_text(text: str, renames: Sequence[Rename]) -> str:
    for rename in renames:
        text = rename.pattern.sub(rename.moved, text)
    return text


def unknown_path_pattern(previous: str) -> re.Pattern[str]:
    segments = [re.escape(segment) for segment in previous.split(".")]
    return re.compile(r"(?<!\w)" + r"(?:/|\\+\.|\.)".join(segments) + r"(?!\w)")


def listed_files(root: Path, patterns: Sequence[str], renames: Sequence[Rename], title: str) -> list[str]:
    return [f"{title} {relative_text(root, path)}" for path in files_matching(root, patterns) if (text := file_text(path)) is not None and any(rename.pattern.search(text) for rename in renames)]


def folders_after_move(root: Path, top: Path, plan: MovePlan) -> set[Path]:
    remaining = {path for path in folder_files(root, top) if path not in plan.file_targets and path not in plan.dropped_files}
    arrived = {target for target in plan.file_targets.values() if target.is_relative_to(top)}
    return {folder for path in remaining | arrived for folder in path.parents if folder.is_relative_to(top) and folder != top}


def orphan_test_folders(root: Path, plan: MovePlan) -> set[str]:
    source_top = root / "src"
    source_folders = {folder.relative_to(source_top) for folder in folders_after_move(root, source_top, plan)}
    unmatched: set[str] = set()
    for test_root in TEST_ROOTS:
        relative_folders = {folder.relative_to(root / test_root) for folder in folders_after_move(root, root / test_root, plan)}
        unmatched.update(f"{test_root}/{folder.as_posix()}" for folder in relative_folders - source_folders if not HELPER_FOLDERS & set(folder.parts) and folder.parts[0] != SCRIPTS_FOLDER)
    return unmatched


def unmatched_test_folders(root: Path, plan: MovePlan) -> list[str]:
    return sorted(orphan_test_folders(root, plan) - orphan_test_folders(root, EMPTY_PLAN))


def engine_layer_line(root: Path, plan: MovePlan) -> str | None:
    if not any(source.is_relative_to(root / ENGINE_SOURCE) and target.is_relative_to(root / ENGINE_TARGET) for source, target in plan.file_targets.items()):
        return None
    engine_files = [path for path in folder_files(root, root / ENGINE_SOURCE) if path.suffix == ".py" and path.name != "__init__.py" and path not in plan.file_targets]
    return LAYER_PATTERN_TWO_FOLDERS if engine_files else LAYER_PATTERN_NEW_FOLDER


def with_engine_layer_line(text: str, line: str | None) -> str:
    if line is None:
        return text
    return text.replace(LAYER_PATTERN_OLD_FOLDER, line).replace(LAYER_PATTERN_TWO_FOLDERS, line)


def plan_renames(root: Path, pairs: Sequence[tuple[Path, Path]]) -> tuple[Rename, ...]:
    dotted = [Rename(module_name(root, source), module_name(root, target), DOTTED_SEPARATORS) for source, target in pairs]
    paths = [Rename(relative_text(root, source), relative_text(root, target), PATH_SEPARATORS) for source, target in pairs]
    return tuple(dotted + paths)


def test_file_pairs(root: Path, source: Path, target: Path) -> list[tuple[Path, Path]]:
    if not source.is_relative_to(root / "src"):
        return []
    source_folder, target_folder = source.parent.relative_to(root / "src"), target.parent.relative_to(root / "src")
    pairs = [(root / test_root / source_folder / name, root / test_root / target_folder / moved_name)
             for test_root, name, moved_name in (("tests/unit", f"test_{source.name}", f"test_{target.name}"), ("tests/stories", source.name, target.name))]
    return [(test_file, moved_test_file) for test_file, moved_test_file in pairs if test_file.is_file()]


def test_folder_pairs(root: Path, source: Path, target: Path) -> list[tuple[Path, Path]]:
    source_folder, target_folder = source.relative_to(root / "src"), target.relative_to(root / "src")
    return [(root / test_root / source_folder, root / test_root / target_folder) for test_root in TEST_ROOTS if (root / test_root / source_folder).is_dir()]


def moved_pair_lines(root: Path, category: str, pairs: Sequence[tuple[Path, Path]]) -> tuple[str, ...]:
    return tuple(f"move {category} {relative_text(root, source)} to {relative_text(root, target)}" for source, target in pairs)


def file_plan(root: Path, source: Path, target: Path) -> MovePlan:
    tests = test_file_pairs(root, source, target)
    pairs = [(source, target), *tests]
    return MovePlan(dict(pairs), (), (), plan_renames(root, pairs), True, moved_pair_lines(root, "test file", tests))


def is_empty_package_file(path: Path) -> bool:
    return path.name == "__init__.py" and not path.read_text().strip()


def folder_plan(root: Path, source: Path, target: Path) -> MovePlan:
    tests = test_folder_pairs(root, source, target) if source.is_relative_to(root / "src") else []
    pairs = [(source, target), *tests]
    file_targets: dict[Path, Path] = {}
    dropped: list[Path] = []
    for folder, folder_target in pairs:
        for path in folder_files(root, folder):
            destination = folder_target / path.relative_to(folder)
            if destination.exists() and is_empty_package_file(path):
                dropped.append(path)
                continue
            file_targets[path] = destination
    return MovePlan(file_targets, tuple(dropped), tuple(folder for folder, _ in pairs), plan_renames(root, pairs), False, moved_pair_lines(root, "folder", pairs))


def move_plan(root: Path, source: Path, target: Path) -> MovePlan:
    if source.is_dir():
        return folder_plan(root, source, target)
    if source.is_file():
        return file_plan(root, source, target)
    raise MoveError(f"{relative_text(root, source)} does not exist")


def without_allow_list_entries(path: Path, text: str, moved_paths: set[str]) -> str:
    if not path.match(ALLOW_LISTED_RULE_PATTERN):
        return text
    rule = json.loads(text)
    reject = rule["find"]["reject"]
    remaining = [step for step in reject if step.get("file") not in moved_paths]
    if len(remaining) == len(reject):
        return text
    rule["find"]["reject"] = remaining
    return json.dumps(rule, indent=4) + "\n"


def planned_files(root: Path, plan: MovePlan) -> dict[Path, str]:
    collisions = [relative_text(root, target) for target in plan.file_targets.values() if target.exists()]
    if collisions:
        raise MoveError("\n".join(f"{path} exists already" for path in collisions))
    unmatched = unmatched_test_folders(root, plan)
    if unmatched:
        raise MoveError("test folders with no source folder after the move:\n" + "\n".join(unmatched))
    layer_line = engine_layer_line(root, plan)
    changed: dict[Path, str] = {}
    unplaced: list[str] = []
    for path in python_files(root):
        rewrite = FileRewrite(path, relative_text(root, path), module_name(root, path), plan.renames)
        unplaced.extend(rewrite.unplaced)
        if plan.guards_file(path) and rewrite.has_edits_outside_imports:
            raise MoveError(f"{rewrite.label}: the move would change a line of the moved file that is not an import")
        edited = with_engine_layer_line(rewrite.edited_text(), layer_line)
        if edited != rewrite.text:
            changed[path] = edited
    moved_paths = {relative_text(root, source) for source in plan.file_targets}
    for path in files_matching(root, TEXT_FILE_PATTERNS):
        text = file_text(path)
        if text is None:
            continue
        edited = rewritten_text(without_allow_list_entries(path, text, moved_paths), plan.renames)
        if any(unknown_path_pattern(rename.previous).search(edited) for rename in plan.renames if rename.separators == DOTTED_SEPARATORS):
            unplaced.append(f"{relative_text(root, path)}: names the file in a form the tool cannot rewrite")
        if edited != text:
            changed[path] = edited
    if unplaced:
        raise MoveError("references the tool cannot rewrite:\n" + "\n".join(unplaced))
    return changed


def missing_package_files(root: Path, target: Path) -> list[Path]:
    folders = [folder for folder in target.parents if root in folder.parents and folder != root / target.relative_to(root).parts[0]]
    return [folder / "__init__.py" for folder in reversed(folders) if not (folder / "__init__.py").exists()]


def applied_move(root: Path, plan: MovePlan, changed: dict[Path, str]) -> None:
    for path, text in changed.items():
        path.write_text(text)
    for source, target in plan.file_targets.items():
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(source, target)
    for path in plan.dropped_files:
        path.unlink()
    for folder in plan.emptied_folders:
        shutil.rmtree(folder)
    for package_file in sorted({package_file for target in plan.file_targets.values() if target.suffix == ".py" for package_file in missing_package_files(root, target)}):
        package_file.write_text("")


def move_path(root: Path, source: Path, target: Path, leave_alias: bool = False, dry_run: bool = False) -> list[str]:
    if leave_alias:
        raise MoveError(f"{relative_text(root, source)}: a move leaves no alias at the old path")
    plan = move_plan(root, source, target)
    changed = planned_files(root, plan)
    report = [*plan.report_lines, *(f"change {relative_text(root, path)}" for path in changed)]
    report += listed_files(root, RECORDING_FILE_PATTERNS, plan.renames, "not rewritten, a recording:")
    report += listed_files(root, PLUGIN_FILE_PATTERNS, plan.renames, "not rewritten, a plugin:")
    python_count = sum(path.suffix == ".py" for path in changed)
    report.append(f"{python_count} Python files and {len(changed) - python_count} other files change")
    if not dry_run:
        applied_move(root, plan, changed)
    return report


def git_output(folder: Path, *arguments: str) -> str:
    completed = subprocess.run(["git", "-C", str(folder), *arguments], capture_output=True, text=True, check=False)
    if completed.returncode != 0:
        raise MoveError(f"git {' '.join(arguments)}: {completed.stderr.strip()}")
    return completed.stdout.strip()


def branch_checkout_folder(root: Path, branch: str) -> str | None:
    blocks = git_output(root, "worktree", "list", "--porcelain").split("\n\n")
    return next((block.splitlines()[0].removeprefix("worktree ") for block in blocks if f"branch refs/heads/{branch}" in block.splitlines()), None)


def move_branch(root: Path, branch: str, source: str, target: str) -> list[str]:
    checkout = branch_checkout_folder(root, branch)
    if checkout is not None:
        raise MoveError(f"branch {branch} is checked out in {checkout}: stop that work first")
    tip = git_output(root, "rev-parse", f"refs/heads/{branch}")
    with tempfile.TemporaryDirectory() as folder:
        worktree = Path(folder).resolve() / "worktree"
        git_output(root, "worktree", "add", "--detach", str(worktree), tip)
        try:
            report = move_path(worktree, worktree / source, worktree / target)
            git_output(worktree, "add", "--all")
            git_output(worktree, "commit", "-m", f"Move {source} to {target}")
            git_output(root, "update-ref", f"refs/heads/{branch}", git_output(worktree, "rev-parse", "HEAD"), tip)
        finally:
            git_output(root, "worktree", "remove", "--force", str(worktree))
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="?")
    parser.add_argument("target", nargs="?")
    parser.add_argument("--engine-area", help="moves src/core/base/<area> to src/engine/<area>")
    parser.add_argument("--branch", help="applies the move to this open branch in a temporary worktree and commits it there")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--leave-alias", action="store_true")
    arguments = parser.parse_args()
    source = f"{ENGINE_SOURCE}/{arguments.engine_area}" if arguments.engine_area else arguments.source
    target = f"{ENGINE_TARGET}/{arguments.engine_area}" if arguments.engine_area else arguments.target
    if source is None or target is None:
        parser.error("name a source and a target, or an engine area")
    root = Path(__file__).resolve().parents[1]
    try:
        report = move_branch(root, arguments.branch, source, target) if arguments.branch else move_path(root, root / source, root / target, arguments.leave_alias, arguments.dry_run)
    except MoveError as refusal:
        print(f"refused: {refusal}", file=sys.stderr)
        return 1
    print("\n".join(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
