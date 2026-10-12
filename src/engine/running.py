"""Whether an agent is at work inside a folder, read from what the supervisor wrote when it launched one."""

from pathlib import Path

from agents.terminal import Launched
from engine import runtime
from engine.sessions import alive
from supervisor import LAUNCHED


def running_at(root: Path, folder: Path) -> bool:
    """Whether a session the supervisor launched is running with its working folder inside this one."""
    inside = folder.resolve()
    for path in runtime.sessions(root).glob(f"*/{LAUNCHED}"):
        launched = Launched.read(root, path.parent.name)
        if launched.pid and alive(launched.pid) and launched.cwd and Path(launched.cwd).resolve().is_relative_to(inside):
            return True
    return False
