import argparse
import importlib
import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
import time
from contextlib import contextmanager, nullcontext
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parents[1] / "src"
sys.path.insert(0, str(SRC))

from features.session_recording.demo import BRANCHES, branched  # noqa: E402
from scripts.demo.session import Session  # noqa: E402

SCENARIOS = ("bakery", "helpers", "ledgerly")
SHIPPED = SRC / "web" / "demo" / "scenarios"
SETTLE = 3.0
SERVED = ("heartbeat", "viewer.json")
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


def copied(source: str, target: str) -> None:
    if not stat.S_ISSOCK(os.lstat(source).st_mode):
        shutil.copy2(source, target, follow_symlinks=False)


def kept(project: Path) -> Path:
    copy = Path(tempfile.mkdtemp()) / project.name
    shutil.copytree(project, copy, symlinks=True, copy_function=copied)
    return copy


def restored(copy: Path, project: Path) -> None:
    stopped(project)
    shutil.rmtree(project)
    shutil.copytree(copy, project, symlinks=True, copy_function=copied)
    for left in SERVED:
        (project / ".journal" / "runtime" / left).unlink(missing_ok=True)


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
    copy = None
    labels = {}
    try:
        with recorded(session, folder):
            fork = story.trunk(session)
        copy = kept(project)
        alive = list(session.sleepers)
        for at, (label, branch) in enumerate(story.BRANCHES.items()):
            session.finish()
            restored(copy, project)
            session = Session(project, pace, key, alive=alive)
            with recorded(session, folder and folder / BRANCHES / str(at)):
                session.answered(fork.question, label)
                branch(session, fork)
            labels[label] = str(at)
    finally:
        session.finish()
        stopped(project)
        if copy:
            shutil.rmtree(copy.parent, ignore_errors=True)
    if folder:
        (folder / BRANCHES / "branches.json").write_text(json.dumps(labels))


def shipped(key: str, project: Path, folder: Path) -> Path:
    subprocess.run([str(project / ".journal" / "journal"), "record", "scrub", str(folder)], check=True, capture_output=True, timeout=300)
    into = SHIPPED / f"{key}.json"
    into.write_text(json.dumps(branched(folder)))
    return into


def main() -> None:
    parser = argparse.ArgumentParser(description="Record a demo scenario through the real journal, every answer of its question in turn")
    parser.add_argument("keys", nargs="*", default=list(SCENARIOS))
    parser.add_argument("--pace", type=float, default=1.0)
    parser.add_argument("--projects", type=Path, default=Path.home() / "projects")
    given = parser.parse_args()
    for key in given.keys:
        story = scenario(key)
        project = given.projects / f"demo-{key}"
        folder = given.projects / "demo-recordings" / story.NAME
        shutil.rmtree(folder, ignore_errors=True)
        played(key, project, given.pace, folder)
        print(f"{key}: {shipped(key, project, folder).relative_to(SRC.parent)}")


if __name__ == "__main__":
    main()
