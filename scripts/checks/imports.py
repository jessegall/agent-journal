import ast
import importlib
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
PACKAGES = ("commands", "controllers", "engine", "features", "migrations", "providers", "resources", "surfaces")
ROOTS = (*PACKAGES, "install")


def imports():
    for package in PACKAGES:
        for path in sorted((HERE / package).rglob("*.py")):
            for node in ast.walk(ast.parse(path.read_text())):
                if isinstance(node, ast.ImportFrom) and node.level == 0 and (node.module or "").split(".")[0] in ROOTS:
                    yield path, node


def missing(module: str, name: str) -> str:
    try:
        found = importlib.import_module(module)
    except ImportError as e:
        return str(e)
    if name == "*" or hasattr(found, name):
        return ""
    try:
        importlib.import_module(f"{module}.{name}")
        return ""
    except ImportError:
        return f"{module} has no {name}"


if __name__ == "__main__":
    sys.path.insert(0, str(HERE))
    broken = [f"{path.relative_to(HERE)}:{node.lineno} {why}" for path, node in imports()
              for alias in node.names if (why := missing(node.module, alias.name))]
    print("\n".join(broken) or "every import resolves")
    sys.exit(1 if broken else 0)
