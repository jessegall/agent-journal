"""Every module of the lower packages imports on its own, so no two of them import each other.

A cycle only shows from one side: whichever module is imported first completes before the other
is reached. So each module here is imported first, in a process of its own, which is the only
check that sees every cycle rather than the half the usual entry point happens to miss.
"""

import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parents[2] / "src"
PACKAGES = ("controllers", "declaring", "events", "expects", "framework", "payload", "receiving", "resources", "serving")
AT_ONCE = 8


def modules() -> list[str]:
    return sorted(str(path.relative_to(HERE).with_suffix("")).replace("/", ".")
                  for package in PACKAGES for path in (HERE / package).rglob("*.py")
                  if path.name != "__init__.py" and "__pycache__" not in path.parts)


def cycled(module: str) -> str:
    """What importing this module first says, or nothing when it imports cleanly."""
    run = subprocess.run([sys.executable, "-c", f"import {module}"], capture_output=True, text=True,
                         cwd=HERE.parent, env={"PYTHONPATH": str(HERE), "PATH": "/usr/bin:/bin"}, timeout=120)
    return "" if run.returncode == 0 else f"{module}: {run.stderr.strip().splitlines()[-1]}"


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=AT_ONCE) as pool:
        broken = [said for said in pool.map(cycled, modules()) if said]
    print("\n".join(broken) or f"each of the {len(modules())} modules of the lower packages imports on its own")
    sys.exit(1 if broken else 0)
