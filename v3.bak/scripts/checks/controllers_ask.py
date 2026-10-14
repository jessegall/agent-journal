import ast
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
CONTROLLERS = HERE / "controllers"
# What a controller must not do itself, and the service that does it instead. A controller decides and records; anything with a
# side effect on the world outside the record - a process, an agent, a provider's files - is asked of a service, so there is one
# place where it happens, one place to make it safe, and one place a test can stand in for it.
ASKED_INSTEAD = {
    "subprocess": "the service that runs it, so one place owns what is run and how it is bounded",
    "providers": "SERVED.given(Providers), which knows what a provider offers",
    "agents": "SERVED.given(Processes), which starts and stops an agent",
}
# A module whose whole job is to be that service, named here because it is the one place the machinery belongs.
ALLOWED = {"controllers/secrets/running.py", "controllers/secrets/sessions.py"}


def reaches(tree: ast.Module) -> set[str]:
    found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found |= {alias.name.split(".")[0] for alias in node.names}
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found.add(node.module.split(".")[0])
    return found


def problems() -> list[str]:
    found = []
    for path in sorted(CONTROLLERS.rglob("*.py")):
        if "__pycache__" in path.parts or str(path.relative_to(HERE)) in ALLOWED:
            continue
        for name in sorted(reaches(ast.parse(path.read_text())) & set(ASKED_INSTEAD)):
            found.append(f"{path.relative_to(HERE)} names {name}; a controller asks {ASKED_INSTEAD[name]}")
    return found


if __name__ == "__main__":
    said = problems()
    print("\n".join(said) or "every controller asks a service for what it cannot do itself")
    sys.exit(1 if said else 0)
