import fcntl
import io
import shlex
from contextlib import redirect_stderr, redirect_stdout
from dataclasses import dataclass
from pathlib import Path

from features.plugins.paths import logged, queue_path
from resources.base import PLUGIN
from engine.command_line import command_line

EACH = 5
LONGEST = 4000


def queues(root: Path, plugin: str, default: str) -> list[tuple[Path, str]]:
    found = sorted(queue_path(root, plugin).parent.glob(f"{plugin}.*.queue"))
    return [(queue_path(root, plugin), default), *((place, place.name[len(plugin) + 1:-len(".queue")]) for place in found)]


def taken(where: Path, many: int) -> list[str]:
    if not where.is_file():
        return []
    where.parent.mkdir(parents=True, exist_ok=True)
    with where.open("r+") as held:
        fcntl.flock(held, fcntl.LOCK_EX)
        lines = [line.strip() for line in held.read().splitlines()]
        wanted = [line for line in lines if line and not line.startswith("#")]
        taking, left = wanted[:many], wanted[many:]
        held.seek(0)
        held.write("".join(f"{line}\n" for line in left))
        held.truncate()
    return taking


def ran(root: Path, env: str, line: str) -> tuple[bool, str]:
    out, err = io.StringIO(), io.StringIO()
    try:
        words = shlex.split(line[:LONGEST])
    except ValueError as why:
        return False, str(why)
    if not words:
        return True, ""
    if any(word == "--env" or word.startswith("--env=") for word in words):
        return False, "a queued command runs in the environment of the event it answers; it names no --env"
    try:
        with redirect_stdout(out), redirect_stderr(err):
            code = command_line().run(["--root", str(root), "--env", env, "--as", PLUGIN, *words])
    except SystemExit as why:
        return False, f"the words were not a journal command ({why.code})"
    except Exception as why:
        return False, str(why)
    return code == 0, err.getvalue().strip() or ("" if code == 0 else f"the command ended with code {code}")


@dataclass(frozen=True)
class Refusal:
    env: str
    line: str
    why: str


def drain(root: Path, plugin: str, default: str, many: int = EACH) -> tuple[int, list[Refusal]]:
    done, refused = 0, []
    for line, env in ((line, env) for place, env in queues(root, plugin, default) for line in taken(place, many)):
        ok, why = ran(root, env, line)
        done += 1
        if not ok:
            logged(root, plugin, f"{line} was refused: {why}")
            refused.append(Refusal(env, line, why))
    return done, refused
