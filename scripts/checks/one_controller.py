import ast
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
ROUTES = (HERE / "commands" / "http.py", *sorted((HERE / "features").glob("*/routes.py")))
COMMAND_CODE = (HERE / "commands" / "cli.py", HERE / "commands" / "queries.py", *sorted((HERE / "controllers").rglob("*.py")),
                *sorted((HERE / "features").glob("*/controller.py")), *sorted((HERE / "features").glob("*/commands.py")))
REACHES_A_CONTROLLER = {"controller", "invoked", "captured"}
OPERATIONAL = {
    "/api/hook/{provider}": "an agent's hook, answered by the hook runner",
    "/api/run": "runs a journal command line, the CLI itself",
    "/api/{env}/stream": "pushes the event log as it grows",
    "/api/{env}/health": "takes the record's locks to show they are free",
    "/api/{env}/console": "files a viewer error",
    "/api/upgrade": "installs a new build",
    "/api/stop": "stops the server",
    "/api/update/check": "asks for a newer release",
    "/api/extension": "describes the browser extension in the package",
    "/extension.zip": "serves the browser extension",
    **dict.fromkeys(("/api/{env}/project-files/find", "/api/{env}/file", "/api/{env}/diff", "/api/{env}/commit/{sha}"),
                    "reads the project's own files and git, not the record"),
}


def routes(path: Path) -> list[tuple[str, ast.FunctionDef]]:
    tree = ast.parse(path.read_text())
    return [(str(decorator.args[1].value), node) for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)
            for decorator in node.decorator_list
            if isinstance(decorator, ast.Call) and getattr(decorator.func, "id", "") in ("route", "handles") and len(decorator.args) > 1]


def called(node: ast.AST) -> set[str]:
    return {name for call in ast.walk(node) if isinstance(call, ast.Call) and (name := getattr(call.func, "id", "") or getattr(call.func, "attr", ""))}


def reached(handler: ast.FunctionDef, path: Path) -> set[str]:
    local = {node.name: node for node in ast.parse(path.read_text()).body if isinstance(node, ast.FunctionDef)}
    names, seen = called(handler), set()
    while names & local.keys() - seen:
        name = (names & local.keys() - seen).pop()
        seen.add(name)
        names |= called(local[name])
    return names


def classes(tree: ast.AST) -> set[str]:
    return {node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)}


def defined() -> set[str]:
    trees = [ast.parse(path.read_text()) for path in HERE.rglob("*.py") if path not in ROUTES and "web" not in path.parts]
    return {node.name for tree in trees for node in tree.body if isinstance(node, (ast.FunctionDef, ast.ClassDef))}


def shared() -> set[str]:
    trees = [ast.parse(path.read_text()) for path in COMMAND_CODE]
    return set().union(*(called(tree) | classes(tree) for tree in trees)) & defined()


def problems() -> list[str]:
    with_the_cli = shared()
    return [f"{path.relative_to(HERE)}:{handler.lineno} {pattern} answers from code no controller method or journal command uses"
            for path in ROUTES for pattern, handler in routes(path)
            if pattern not in OPERATIONAL and not reached(handler, path) & (REACHES_A_CONTROLLER | with_the_cli)]


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every endpoint reaches a controller method or a funnel the CLI shares")
    sys.exit(1 if found else 0)
