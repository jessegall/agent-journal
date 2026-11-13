import ast
import importlib
from functools import cache
from pathlib import Path


@cache
def source_text(path: Path) -> str:
    return path.read_text()


@cache
def source_tree(path: Path) -> ast.Module:
    return ast.parse(source_text(path))


# The names a file imports, each with the module it comes from and the attribute it reads there; a plain import of a
# module under another name has no attribute.
def imported_names(tree: ast.Module) -> dict[str, tuple[str, str | None]]:
    names: dict[str, tuple[str, str | None]] = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module and not node.level:
            names.update({alias.asname or alias.name: (node.module, alias.name) for alias in node.names})
        if isinstance(node, ast.Import):
            names.update({alias.asname: (alias.name, None) for alias in node.names if alias.asname})
    return names


def imported_object(module: str, attribute: str | None) -> object:
    imported = importlib.import_module(module)
    if attribute is None:
        return imported
    return getattr(imported, attribute) if hasattr(imported, attribute) else importlib.import_module(f"{module}.{attribute}")
