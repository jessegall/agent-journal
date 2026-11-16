import ast
from typing import TypeGuard


class ModuleImports:
    """The shape of an import of a named module, a from-import with its module given."""

    @staticmethod
    def is_module_import(node: ast.AST) -> TypeGuard[ast.ImportFrom]:
        return isinstance(node, ast.ImportFrom) and bool(node.module)
