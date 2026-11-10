import ast
from dataclasses import dataclass
from pathlib import Path

from engine.registry.setting_tree import SettingTree
from engine.setting.setting_declaration import GROUP_TYPE, REFERENCE_TYPE
from core.modules import DEFAULT_MODULES
from engine.module.suite_list import SuiteList
from suites import DEFAULT_SUITES
from tests.unit.source_tree import source_tree
from tunnels import DEFAULT_TUNNELS

SOURCE = Path(__file__).resolve().parents[4] / "src"
SKIPPED_FOLDERS = ("dist", "migrations", "__pycache__", "node_modules")

# a declared setting nothing reads yet, with the task that gives it a reader or removes it
UNREAD_SETTINGS: dict[str, str] = {}


@dataclass(frozen=True)
class Literal:
    """A string in the code that may name a setting, and the constant it is assigned to, if it is assigned to one."""

    text: str
    constant: str | None


@dataclass(frozen=True)
class CodeIndex:
    """Every string outside a setting's declaration, and every name the code uses, in one pass over the source."""

    literals: tuple[Literal, ...]
    used_names: frozenset[str]

    def is_read(self, full_key: str, short_key: str) -> bool:
        for literal in self.literals:
            last = short_key.rsplit(".", 1)[-1]
            if literal.text in (full_key, last) or literal.text.endswith(f".{last}"):
                if literal.constant is None or literal.constant in self.used_names:
                    return True
        return False


def literal_text(node: ast.AST) -> str | None:
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.JoinedStr):
        return "".join(part.value if isinstance(part, ast.Constant) else "{}" for part in node.values)
    return None


def read_index(trees: list[ast.Module]) -> CodeIndex:
    literals: list[Literal] = []
    used: set[str] = set()
    for tree in trees:
        owner = {child: parent for parent in ast.walk(tree) for child in ast.iter_child_nodes(parent)}
        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                used.add(node.id)
            elif isinstance(node, ast.Attribute) and isinstance(node.ctx, ast.Load):
                used.add(node.attr)
            text = literal_text(node)
            parent = owner.get(node)
            if text is None or isinstance(parent, ast.JoinedStr | ast.FormattedValue):
                continue
            if isinstance(parent, ast.Call) and getattr(parent.func, "id", getattr(parent.func, "attr", "")) == "SettingValue":
                member = owner.get(parent)
                if isinstance(member, ast.Assign) and len(member.targets) == 1 and isinstance(member.targets[0], ast.Name) and parent.args and parent.args[0] is node:
                    literals.append(Literal(text, member.targets[0].id))
                continue
            target = parent.targets[0] if isinstance(parent, ast.Assign) and len(parent.targets) == 1 else getattr(parent, "target", None) if isinstance(parent, ast.AnnAssign) else None
            literals.append(Literal(text, target.id if isinstance(target, ast.Name) else None))
    return CodeIndex(tuple(literals), frozenset(used))


def source_index() -> CodeIndex:
    files = [path for path in SOURCE.rglob("*.py") if not any(part in SKIPPED_FOLDERS for part in path.parts)]
    return read_index([source_tree(path) for path in files])


def declared_settings() -> dict[str, str]:
    modules = (*DEFAULT_MODULES, *SuiteList(DEFAULT_SUITES).modules(), *DEFAULT_TUNNELS)
    return {entry.key: entry.key.removeprefix(f"{module.name}.") for module in modules for entry in SettingTree().entries(module.name, module.settings)
            if entry.type not in (GROUP_TYPE, REFERENCE_TYPE) and "*" not in entry.key}


def test_every_declared_setting_is_read_by_some_code_or_listed_with_its_reason():
    index = source_index()
    unread = sorted(key for key, short in declared_settings().items() if key not in UNREAD_SETTINGS and not index.is_read(key, short))
    assert not unread, f"declared settings that no code reads: implement each or remove it, or list it in UNREAD_SETTINGS with a reason: {unread}"


def test_a_setting_listed_as_unread_is_still_declared():
    removed = sorted(key for key in UNREAD_SETTINGS if key not in declared_settings())
    assert not removed, f"remove from UNREAD_SETTINGS, no longer declared: {removed}"


def sample_index(tmp_path, text: str) -> CodeIndex:
    sample = tmp_path / "sample.py"
    sample.write_text(text)
    return read_index([source_tree(sample)])


def test_a_key_held_by_a_constant_nothing_uses_counts_as_unread(tmp_path):
    index = sample_index(tmp_path, 'LOST = f"{MODULE}.lost-switch"\nUSED = f"{MODULE}.used-switch"\nsetting = settings.flag(USED)\n')
    assert not index.is_read("journal.x.lost-switch", "lost-switch")
    assert index.is_read("journal.x.used-switch", "used-switch")


def test_a_key_written_where_it_is_read_counts_as_read(tmp_path):
    assert sample_index(tmp_path, 'value = settings.flag("journal.x.direct")\n').is_read("journal.x.direct", "direct")
