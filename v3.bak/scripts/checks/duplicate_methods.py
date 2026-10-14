import ast
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / "src"
SKIPPED = ("migrations", "node_modules", "web")
PAIRED = ("setter", "getter", "deleter", "register", "overload")


def paired(method: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    """A method that names another of its own name on purpose: a property's setter, an overload, a registered variant."""
    return any(part in ast.dump(decorator) for decorator in method.decorator_list for part in PAIRED)


def twice(tree: ast.AST) -> list[tuple[str, str, list[int]]]:
    found = []
    for kind in ast.walk(tree):
        if not isinstance(kind, ast.ClassDef):
            continue
        lines: dict[str, list[int]] = {}
        for method in kind.body:
            if isinstance(method, (ast.FunctionDef, ast.AsyncFunctionDef)) and not paired(method):
                lines.setdefault(method.name, []).append(method.lineno)
        found += [(kind.name, name, at) for name, at in lines.items() if len(at) > 1]
    return found


def problems() -> list[str]:
    text = []
    for path in sorted(HERE.rglob("*.py")):
        if any(part in SKIPPED for part in path.relative_to(HERE).parts):
            continue
        for kind, name, at in twice(ast.parse(path.read_text())):
            text.append(f"{path.relative_to(HERE)}: {kind}.{name} is defined twice, at lines {' and '.join(map(str, at))}; the later one silently replaces the earlier, so rename or merge them")
    return text


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) if found else "no class defines a method twice")
    sys.exit(1 if found else 0)
