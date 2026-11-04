import os
from pathlib import Path
import subprocess
from collections.abc import Sequence

from tests.stories.server.support.server_client import ServerStory

VIEWER_FOLDER = Path(__file__).resolve().parents[4] / "src" / "viewer"


class BrowserStoryTimeout(AssertionError):
    @classmethod
    def for_script(cls, script: str, error: subprocess.TimeoutExpired) -> "BrowserStoryTimeout":
        return cls(f"""{script} exceeded {error.timeout} seconds.
stdout:
{cls.output_text(error.stdout)}
stderr:
{cls.output_text(error.stderr)}""")

    @staticmethod
    def output_text(value: str | bytes | None) -> str:
        if value is None:
            return ""
        return value.decode(errors="replace") if isinstance(value, bytes) else value


def expect_browser(story: ServerStory, script: str, arguments: Sequence[str], login_name: str = "Ada") -> None:
    key = story.viewer_key(login_name)
    address = f"http://127.0.0.1:{story.viewer_port()}/?key={key}&environment=main"
    expect_browser_at(address, script, arguments)


def expect_browser_at(address: str, script: str, arguments: Sequence[str]) -> None:
    try:
        finished = subprocess.run(
            ["node", f"tests/{script}", address, *arguments], cwd=VIEWER_FOLDER, capture_output=True, text=True, timeout=60,
            env={**os.environ, "DEBUG": f"{os.environ.get('DEBUG', '')},pw:api"},
        )
    except subprocess.TimeoutExpired as error:
        raise BrowserStoryTimeout.for_script(script, error) from error
    assert finished.returncode == 0, finished.stdout + finished.stderr
