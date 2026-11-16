import ast
import hashlib
from pathlib import Path

from engine.file.file_access import FileAccess

FUNCTION_NODES = (ast.FunctionDef, ast.AsyncFunctionDef)


class FunctionBodies:
    """A hash of each function's own definition in a source file, by the name Python gives its code object
    (`Class.method`, `outer.<locals>.inner`), so a change outside a function leaves its hash as it was."""

    @staticmethod
    def hashes(source: str) -> dict[str, str]:
        match: dict[str, str] = {}
        FunctionBodies.walk(ast.parse(source).body, "", match)
        return match

    @staticmethod
    def file_hashes(path: Path) -> dict[str, str]:
        if not FileAccess.is_file(path):
            return {}
        try:
            return FunctionBodies.hashes(FileAccess.read(path))
        except SyntaxError:
            return {}

    @staticmethod
    def walk(nodes: list[ast.stmt], prefix: str, found: dict[str, str]) -> None:
        for node in nodes:
            if isinstance(node, ast.ClassDef):
                FunctionBodies.walk(node.body, f"{prefix}{node.name}.", found)
                continue
            if not isinstance(node, FUNCTION_NODES):
                continue
            name = f"{prefix}{node.name}"
            found[name] = hashlib.sha256(ast.dump(node).encode()).hexdigest()[:16]
            FunctionBodies.walk(node.body, f"{name}.<locals>.", found)
