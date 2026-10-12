"""A census of the codebase: what each feature registers, owns and weighs, which events exist and where they are declared, where a feature announces by hand, and how many features lean on each shared module.

    python3 scripts/census.py [--root SRC]

Reads the tree with ast and prints plain text tables; it imports nothing of the journal and starts nothing. Run it on any day and compare the numbers.
"""
import ast
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
KINDS = ("events.handler", "commands.add", "agent.interceptor", "commands.intercept", "routes.add", "client.formatter", "agent.canceler", "agent.append_to_line", "agent.responder")
HEADS = ("handler", "add", "intercept", "icmd", "route", "format", "cancel", "append", "respond")
SHARED = ("base", "parts", "groups", "journal", "trigger", "settings", "routing", "format", "sending", "wiring", "actions", "recital", "renames", "switches")
EVENT_ROOTS = {"TypedEvent"}
HAND_WRITTEN = ("emit", "announce")


def parsed(path: Path) -> ast.Module | None:
    try:
        return ast.parse(path.read_text())
    except (SyntaxError, UnicodeDecodeError):
        return None


def python_files(folder: Path) -> list[Path]:
    return sorted(p for p in folder.rglob("*.py") if "__pycache__" not in p.parts)


def lines_of(folder: Path) -> int:
    return sum(len(p.read_text().splitlines()) for p in python_files(folder))


def tail(node: ast.expr, parts: int = 2) -> str:
    """The last dotted words of a call's target, such as events.handler for journal.events.handler."""
    return ".".join(ast.unparse(node).split(".")[-parts:])


def registrations(path: Path) -> Counter:
    found: Counter = Counter()
    tree = parsed(path)
    for node in ast.walk(tree) if tree else []:
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and tail(node.func) in KINDS:
            found[tail(node.func)] += 1
    return found


def test_methods(path: Path) -> int:
    tree = parsed(path)
    return sum(isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name.startswith("test") for n in ast.walk(tree)) if tree else 0


def features(src: Path) -> list[Path]:
    return sorted(p for p in (src / "features").iterdir() if p.is_dir() and p.name != "__pycache__")


def feature_rows(src: Path) -> list[dict]:
    rows = []
    for folder in features(src):
        kinds = registrations(folder / "feature.py") if (folder / "feature.py").is_file() else Counter()
        rows.append({"name": folder.name, "kinds": kinds, "tests": test_methods(folder / "test.py") if (folder / "test.py").is_file() else 0,
                     "controller": (folder / "controller.py").is_file(), "lines": lines_of(folder), "has_feature": (folder / "feature.py").is_file()})
    return rows


def class_table(src: Path) -> dict:
    """Every class under src/engine/events and src/features by name: its file, line, bases, and whether its body declares `on`."""
    table: dict = {}
    for folder in (src / "engine" / "events", src / "features"):
        for path in python_files(folder):
            tree = parsed(path)
            for node in ast.walk(tree) if tree else []:
                if isinstance(node, ast.ClassDef):
                    declares = any(isinstance(s, ast.AnnAssign) and getattr(s.target, "id", "") == "on" or isinstance(s, ast.Assign) and any(getattr(t, "id", "") == "on" for t in s.targets)
                                   for s in node.body)
                    table.setdefault(node.name, []).append({"file": path.relative_to(src).as_posix(), "line": node.lineno, "bases": [ast.unparse(b).split(".")[-1] for b in node.bases], "on": declares})
    return table


def lineage(entry: dict, table: dict, seen: frozenset = frozenset()) -> list[dict]:
    """A class and the classes it stands on, found by name through the table."""
    return [entry, *(c for base in entry["bases"] if base in table and base not in seen for c in lineage(table[base][0], table, seen | {base}))]


def is_event(entry: dict, table: dict) -> bool:
    """A concrete event: it stands on TypedEvent, and it or a class between it and TypedEvent says which moment it is for. The bases that only group events say none."""
    chain = lineage(entry, table)
    return any("TypedEvent" in c["bases"] for c in chain) and any(c["on"] for c in chain if c is not table["TypedEvent"][0])


def events(src: Path) -> tuple[list, list]:
    """Every concrete event as (name, file, line, how it names its moment): its own `on`, or the one it inherits."""
    table = class_table(src)
    found = sorted((name, e["file"], e["line"], "own" if e["on"] else "inherited") for name, entries in table.items() for e in entries if is_event(e, table))
    return [e for e in found if e[1].startswith("engine/events")], [e for e in found if e[1].startswith("features/")]


def hand_announced(src: Path, tests: bool = False) -> list[tuple[str, int, str]]:
    """Calls of record.emit or bus.announce inside features, outside test.py files unless asked."""
    found = []
    for path in (p for p in python_files(src / "features") if tests or p.name != "test.py"):
        tree = parsed(path)
        for node in ast.walk(tree) if tree else []:
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr in HAND_WRITTEN:
                target = ast.unparse(node.func.value)
                if target.split(".")[-1] in ("record", "bus"):
                    found.append((path.relative_to(src).as_posix(), node.lineno, f"{target}.{node.func.attr}"))
    return sorted(found)


def shared_rows(src: Path) -> list[dict]:
    counts = {name: {"features": set(), "statements": 0} for name in SHARED}
    for folder in features(src):
        for path in python_files(folder):
            tree = parsed(path)
            for node in ast.walk(tree) if tree else []:
                for name in imports_named(node):
                    counts[name]["features"].add(folder.name)
                    counts[name]["statements"] += 1
    return [{"name": name, "features": len(c["features"]), "statements": c["statements"], "exists": (src / "features" / f"{name}.py").is_file() or (src / "features" / name).is_dir()} for name, c in counts.items()]


def imports_named(node: ast.AST) -> list[str]:
    if isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
        if node.module == "features":
            return [a.name for a in node.names if a.name in SHARED]
        if node.module.startswith("features.") and node.module.split(".")[1] in SHARED:
            return [node.module.split(".")[1]]
    if isinstance(node, ast.Import):
        return [a.name.split(".")[1] for a in node.names if a.name.startswith("features.") and a.name.split(".")[1] in SHARED]
    return []


def table(headers: list[str], rows: list[list], left: int = 1) -> str:
    cells = [[str(c) for c in row] for row in rows]
    widths = [max(len(h), *(len(r[i]) for r in cells)) if cells else len(h) for i, h in enumerate(headers)]
    fit = lambda row: "  ".join(c.ljust(w) if i < left else c.rjust(w) for i, (c, w) in enumerate(zip(row, widths))).rstrip()
    return "\n".join([fit(headers), fit(["-" * w for w in widths]), *(fit(r) for r in cells)])


def report(src: Path) -> str:
    rows = feature_rows(src)
    totals = Counter()
    for row in rows:
        totals.update(row["kinds"])
    engine, inside = events(src)
    announced = hand_announced(src)
    in_tests = [a for a in hand_announced(src, tests=True) if a not in announced]
    shared = shared_rows(src)
    head = (f"{len(rows)} feature packages under src/features, {sum(r['has_feature'] for r in rows)} with a feature.py (without: {', '.join(r['name'] for r in rows if not r['has_feature'])}); "
            f"{sum(totals.values())} registrations ({', '.join(f'{totals[k]} {k}' for k in KINDS)}); "
            f"{sum(r['tests'] for r in rows)} test methods in {sum(1 for r in rows if r['tests'])} test.py files; {sum(r['controller'] for r in rows)} features own a controller.py.")
    per_feature = table(["feature", *HEADS, "tests", "controller", "lines"],
                        [[r["name"], *(r["kinds"][k] or "" for k in KINDS), r["tests"] or "", "yes" if r["controller"] else "", r["lines"]] for r in rows])
    return "\n\n".join([
        head,
        "Per feature (registrations in its feature.py, test methods in its test.py, python lines in the package):\n" + per_feature,
        f"Event classes in src/engine/events, {sum(e[3] == 'own' for e in engine)} naming their moment with their own `on` and the rest inheriting it: {len(engine)}\n"
        + table(["event", "file", "line", "on"], [list(e) for e in engine]),
        f"Event classes declared inside features: {len(inside)}\n" + table(["event", "file", "line", "on"], [list(e) for e in inside]),
        f"Direct record.emit or bus.announce calls inside features, outside test files: {len(announced)} (and {len(in_tests)} more inside test.py files)\n"
        + table(["file", "line", "call"], [list(a) for a in announced]),
        "Shared modules beside the features, and how many features import each (features, import statements):\n"
        + table(["module", "features", "imports", "exists"], [[s["name"], s["features"], s["statements"], "yes" if s["exists"] else "no"] for s in shared]),
    ])


if __name__ == "__main__":
    src = Path(sys.argv[sys.argv.index("--root") + 1]) if "--root" in sys.argv else ROOT
    print(report(src))
