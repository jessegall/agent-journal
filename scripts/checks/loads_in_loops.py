import ast
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / "src"
LOOPS = (ast.For, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)
# (file, line text) pairs that load a row to change it or hand it on, each with the reason a copy is needed.
ALLOWED = {
    ("controllers/base.py", 'return [self.load(row["n"]) for row in self.rows.unread(who)]'): "returns copies to the caller, which may change them",
    ("controllers/links.py", 'return [self.load(row["n"]) for row in self.rows.linked_to(ref) if not row["deleted"]]'): "returns copies to the caller, which may change them",
    ("features/form_of_address/controller.py", 'held = {r.title: r for r in (profiles.load(row["n"]) for row in profiles.rows.summaries() if not row["deleted"]) if r.system}'): "sets fields on the shipped profiles it loaded and saves them",
}


def is_summary_load(call: ast.AST) -> bool:
    """A load of the row a summary names: `.load(row["n"])`."""
    if not (isinstance(call, ast.Call) and isinstance(call.func, ast.Attribute) and call.func.attr == "load" and call.args):
        return False
    key = call.args[0]
    return isinstance(key, ast.Subscript) and isinstance(key.slice, ast.Constant) and key.slice.value == "n"


def loads_in_loops(tree: ast.AST) -> list[ast.Call]:
    found = []
    for loop in ast.walk(tree):
        if not isinstance(loop, LOOPS):
            continue
        body = loop.body if isinstance(loop, ast.For) else [loop]
        found += [call for statement in body for call in ast.walk(statement) if is_summary_load(call)]
    return found


def problems() -> list[str]:
    text = []
    for path in sorted(HERE.rglob("*.py")):
        name = str(path.relative_to(HERE))
        if path.name == "test.py" or "migrations" in path.parts or "node_modules" in path.parts:
            continue
        lines = path.read_text().splitlines()
        for call in {id(c): c for c in loads_in_loops(ast.parse("\n".join(lines)))}.values():
            if (name, lines[call.lineno - 1].strip()) in ALLOWED:
                continue
            text.append(f"{name}:{call.lineno} loads each row a summary names inside a loop; a row that is only read is peeked, and one that is changed is allowed in scripts/checks/loads_in_loops.py with its reason")
    return text


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) if found else "no loop loads a row it only reads")
    sys.exit(1 if found else 0)
