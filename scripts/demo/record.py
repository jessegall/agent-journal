import argparse
import importlib
import shutil
import subprocess
import sys
import time
from contextlib import contextmanager, nullcontext
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parents[1] / "src"
sys.path.insert(0, str(SRC))

from scripts.demo.session import Session  # noqa: E402

SCENARIOS = ("bakery", "ledgerly", "subagents", "helpers", "docs", "memory", "dumps")
SHIPPED = SRC / "web" / "demo" / "scenarios"
SETTLE = 3.0
IGNORED = "__pycache__/\n.journal/\n.claude/\n.codex/\n.agents/\nAGENTS.md\nCLAUDE.md\n.mcp.json\n"


def scenario(key: str):
    return importlib.import_module(f"scripts.demo.{key}")


def git(project: Path, *args: str) -> None:
    subprocess.run(["git", *args], cwd=project, check=True, capture_output=True, timeout=60)


def stopped(project: Path) -> None:
    subprocess.run(["pkill", "-f", str(project / ".journal")], capture_output=True, timeout=30)
    time.sleep(0.5)


def prepared(project: Path, story) -> None:
    stopped(project)
    shutil.rmtree(project, ignore_errors=True)
    shutil.copytree(HERE / "projects" / story.NAME, project)
    (project / ".gitignore").write_text(IGNORED)
    git(project, "init", "-q", "-b", "main")
    git(project, "config", "user.name", "Demo")
    git(project, "config", "user.email", "demo@example.com")
    git(project, "add", "-A")
    git(project, "commit", "-qm", story.FIRST_COMMIT)
    subprocess.run([sys.executable, str(SRC / "install.py"), str(project)], check=True, capture_output=True, timeout=120)


@contextmanager
def recording(session: Session, folder: Path):
    session.journal("record", "start", str(folder))
    try:
        yield
    finally:
        time.sleep(SETTLE)
        session.journal("record", "stop")


def recorded(session: Session, folder: Path | None):
    return recording(session, folder) if folder else nullcontext()


def played(key: str, project: Path, pace: float, folder: Path | None = None) -> None:
    story = scenario(key)
    prepared(project, story)
    session = Session(project, pace, key)
    try:
        with recorded(session, folder):
            story.lesson(session)
    finally:
        session.finish()
        stopped(project)


def shipped(key: str, project: Path, folder: Path) -> Path:
    into = SHIPPED / f"{key}.json"
    for step in (["record", "scrub", str(folder)], ["demo", str(folder), str(into), "--name", scenario(key).NAME]):
        subprocess.run([str(project / ".journal" / "journal"), *step], check=True, capture_output=True, timeout=600)
    return into


def main() -> None:
    parser = argparse.ArgumentParser(description="Record a demo lesson through the real journal")
    parser.add_argument("keys", nargs="*", default=list(SCENARIOS))
    parser.add_argument("--pace", type=float, default=1.0)
    parser.add_argument("--projects", type=Path, default=Path.home() / "projects")
    given = parser.parse_args()
    for key in given.keys:
        project = given.projects / f"demo-{key}"
        folder = given.projects / "demo-recordings" / key
        shutil.rmtree(folder, ignore_errors=True)
        played(key, project, given.pace, folder)
        print(f"{key}: {shipped(key, project, folder).relative_to(SRC.parent)}")


if __name__ == "__main__":
    main()
