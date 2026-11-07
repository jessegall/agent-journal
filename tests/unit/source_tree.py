import ast
from functools import cache
from pathlib import Path


@cache
def source_text(path: Path) -> str:
    return path.read_text()


@cache
def source_tree(path: Path) -> ast.Module:
    return ast.parse(source_text(path))
