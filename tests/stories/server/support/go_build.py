import os
import subprocess
from pathlib import Path

TOOLS_FOLDER = Path(__file__).resolve().parents[4] / "tools"
BUILD_TIMEOUT_SECONDS = 180


class GoBuild:
    """Builds one of the repository's Go programs into a story's folder, statically and under a time limit, once,
    and gives the clean environment the stories run them in, so no journal variable of this session leaks in."""

    @staticmethod
    def built(program: str, binary: Path) -> Path:
        if not binary.exists():
            subprocess.run(["go", "build", "-o", str(binary), "."], cwd=TOOLS_FOLDER / program, check=True, timeout=BUILD_TIMEOUT_SECONDS,
                           capture_output=True, env={**os.environ, "CGO_ENABLED": "0"})
        return binary

    @staticmethod
    def environment(**values: str) -> dict[str, str]:
        return {"PATH": os.environ.get("PATH", ""), "HOME": os.environ.get("HOME", ""), "USER": "story", **values}
