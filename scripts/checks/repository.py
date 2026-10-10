import ast
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / "src"
STORE = HERE / "controllers" / "stored.py"
FUNNEL = ("peek", "load", "summaries", "persist", "remove", "counts", "unread", "linked_to", "by", "reindexed", "text", "write_file", "reparsed", "discard")
ROW_IO = re.compile(r"\.path\([^()]*\)\.(read_text|read_bytes|open|write_text|write_bytes|unlink|replace|rename|stat)")
PARSE = re.compile(r"\.resource\.load\(")
BUILD = re.compile(r"\bRowStore\(")
# (file, what) pairs allowed beside the repository, each with the reason it is not a row of a type.
ALLOWED = {
    ("engine/runtime.py", "row io"): "a marker file of the runtime folder that happens to have a path method",
    ("features/revisions/history.py", "parse"): "a revision page of a doc, kept in the doc's revisions folder, is parsed here",
    ("controllers/base.py", "build"): "the controller makes the one repository it holds",
}


def final_methods(tree: ast.Module) -> set[str]:
    store = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "RowStore")
    return {method.name for method in store.body if isinstance(method, ast.FunctionDef)
            and any(isinstance(mark, ast.Name) and mark.id == "final" for mark in method.decorator_list)}


def problems() -> list[str]:
    text = []
    missing = set(FUNNEL) - final_methods(ast.parse(STORE.read_text()))
    text += [f"controllers/stored.py: RowStore.{name} is a funnel method and must be marked final" for name in sorted(missing)]
    for path in sorted(HERE.rglob("*.py")):
        name = str(path.relative_to(HERE))
        if path.name == "test.py" or "migrations" in path.parts or "node_modules" in path.parts or path == STORE:
            continue
        source = path.read_text()
        for node in ast.walk(ast.parse(source)):
            if isinstance(node, ast.ClassDef) and any((isinstance(base, ast.Name) and base.id == "RowStore") or (isinstance(base, ast.Attribute) and base.attr == "RowStore") for base in node.bases):
                text += [f"{name}:{node.lineno} {node.name} extends RowStore; the repository is final and has no subclass"]
                text += [f"{name}:{method.lineno} {node.name}.{method.name} overrides a funnel method of RowStore" for method in node.body if isinstance(method, ast.FunctionDef) and method.name in FUNNEL]
            if isinstance(node, ast.Assign):
                text += [f"{name}:{node.lineno} replaces RowStore.{target.attr}, a funnel method" for target in node.targets
                         if isinstance(target, ast.Attribute) and target.attr in FUNNEL and isinstance(target.value, ast.Attribute) and target.value.attr == "rows"]
        for n, line in enumerate(source.splitlines(), 1):
            for pattern, what in ((ROW_IO, "row io"), (PARSE, "parse"), (BUILD, "build")):
                if pattern.search(line) and (name, what) not in ALLOWED:
                    text.append(f"{name}:{n} reads, writes, parses or makes a row past its repository ({what}); go through the controller's rows, or allow it in scripts/checks/repository.py with its reason")
    return text


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every funnel method of the repository is final, and nothing reads, writes, parses or makes a row past it")
    sys.exit(1 if found else 0)
