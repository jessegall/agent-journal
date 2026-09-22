import ast
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
PACKAGES = ("commands", "controllers", "engine", "features", "providers", "resources", "surfaces")
SMALLEST = 4


class Shape(ast.NodeTransformer):
    def visit_Name(self, node):
        return ast.copy_location(ast.Name(id="_", ctx=node.ctx), node)

    def visit_arg(self, node):
        return ast.copy_location(ast.arg(arg="_"), node)

    def visit_Constant(self, node):
        return ast.copy_location(ast.Constant(value=type(node.value).__name__), node)


def statements(fn) -> int:
    return sum(isinstance(n, ast.stmt) for n in ast.walk(fn)) - 1


def bodies():
    for package in PACKAGES:
        for path in sorted((HERE / package).rglob("*.py")):
            if path.stem == "test":
                continue
            for fn in ast.walk(ast.parse(path.read_text())):
                if isinstance(fn, (ast.FunctionDef, ast.AsyncFunctionDef)) and statements(fn) >= SMALLEST:
                    shape = ast.dump(Shape().visit(ast.Module(body=fn.body, type_ignores=[])))
                    yield shape, f"{path.relative_to(HERE)}:{fn.lineno} {fn.name}"


def problems() -> list[str]:
    seen = defaultdict(list)
    for shape, where in bodies():
        seen[shape].append(where)
    return [f"the same body is written {len(places)} times, make it one funnel: {', '.join(places)}" for places in seen.values() if len(places) > 1]


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "no function body is written twice")
    sys.exit(1 if found else 0)
