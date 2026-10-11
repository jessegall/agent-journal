import ast
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
PARTS = {"Handler", "TextFormatter", "ToolInterceptor", "Command", "ActionInterceptor"}
FEATURE_METHODS = {"register", "settings_view", "default_for"}
SERVICES = {"dev_faults": {"reports"}, "plugins": {"host"}}
PART_LINES = 50
OLD_MARKERS = {"event", "gate", "formats", "command", "handles", "textformatter", "interceptor"}


def classes(path: Path) -> list[ast.ClassDef]:
    return [node for node in ast.parse(path.read_text()).body if isinstance(node, ast.ClassDef)]


def hooks() -> set[str]:
    """The methods features.base.Feature declares for a feature to override."""
    base = next(node for node in classes(HERE / "features" / "base.py") if node.name == "Feature")
    return {node.name for node in base.body if isinstance(node, ast.FunctionDef) and not node.name.startswith("_")}


def delegates(method: ast.FunctionDef) -> bool:
    """A body that is one call, returned or not, past its docstring: the logic lives in a part."""
    body = [node for node in method.body if not (isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant))]
    return len(body) == 1 and isinstance(getattr(body[0], "value", None), ast.Call)


def problems() -> list[str]:
    found = []
    for folder in sorted(p for p in (HERE / "features").iterdir() if (p / "feature.py").is_file()):
        name = folder.name
        if not (folder / "details.py").is_file():
            found.append(f"features/{name} has no details.py")
        for feature in classes(folder / "feature.py"):
            allowed = FEATURE_METHODS | SERVICES.get(name, set())
            extra = [f.name for f in feature.body if isinstance(f, ast.FunctionDef) and f.name not in allowed and not (f.name in hooks() and delegates(f))]
            if extra:
                found.append(f"features/{name}/feature.py holds logic in {', '.join(extra)}; it belongs in a part")
        for path in sorted(folder.glob("*.py")):
            source = path.read_text()
            for node in ast.walk(ast.parse(source)):
                if isinstance(node, ast.ImportFrom) and node.module == "features.base" and {a.name for a in node.names} & OLD_MARKERS:
                    found.append(f"{path.relative_to(HERE)} imports an old marker from features.base")
            for part in classes(path):
                lines = part.end_lineno - part.lineno + 1
                if any(getattr(base, "id", "") in PARTS for base in part.bases) and lines > PART_LINES:
                    found.append(f"{path.relative_to(HERE)}: {part.name} is {lines} lines; split it, a part stays under {PART_LINES}")
    return found


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every feature is details.py and small registered parts")
    sys.exit(1 if found else 0)
