import os
from pathlib import Path
import subprocess

from tests.stories.server.support.server_client import ServerStory

VIEWER_FOLDER = Path(__file__).resolve().parents[4] / "src" / "viewer"


def expect_browser_tour(story: ServerStory, visible: bool, login_name: str = "Jesse") -> None:
    key = story.viewer_key(login_name)
    address = f"http://127.0.0.1:{story.viewer_port()}/?key={key}&environment=main"
    finished = subprocess.run(
        ["node", "tests/upgradeTour.browser.mjs", address, str(visible).lower()],
        cwd=VIEWER_FOLDER, capture_output=True, text=True, timeout=60,
        env={**os.environ, "CHROMIUM_PATH": os.environ.get("CHROMIUM_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")},
    )
    assert finished.returncode == 0, finished.stdout + finished.stderr
