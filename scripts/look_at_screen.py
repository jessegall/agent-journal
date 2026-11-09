"""Opens a screen of this checkout's built viewer in Chromium and saves a screenshot of it. It starts a story journal
with a server, serves the viewer bundles of this checkout, runs the journal lines given as --setup to put the data
on the screen, takes the picture, prints its path and stops the server. Nothing runs after it ends.
Run with: python3 scripts/look_at_screen.py --window agents.agents --setup "task make 'Fix the cart' --brief 'Check the total'"
A sandboxed worker cannot start Chromium: switch its sandbox off first (journal worker sandbox <n> off)."""
import argparse
import importlib
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

CHECKOUT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(CHECKOUT / "src"), str(CHECKOUT)]

from core.testing.template_databases import TemplateDatabases  # noqa: E402
from tests.stories.server.support.server_client import server_story  # noqa: E402

VIEWER_FOLDER = CHECKOUT / "src" / "viewer"
LOOK_SCRIPT = "tests/lookAtScreen.mjs"
DEFAULT_FIXTURE = "tests.stories.core.support.coding_fixtures:UserBuilder"
DEFAULT_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TOUR_SETTING = "setting set journal.core.viewer.tour-completed true --project"
LOGIN_NAME = "Ada"
SCREENSHOT_SECONDS = 90


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--window", default="agents.agents", help="the window to open and take the picture of")
    parser.add_argument("--setup", action="append", default=[], help="a journal line run in the story journal before the picture; repeatable")
    parser.add_argument("--fixture", default=DEFAULT_FIXTURE, help="module:Class of the story fixture the journal starts from")
    parser.add_argument("--wait-for", default="", help="a CSS selector that must show before the picture")
    parser.add_argument("--output", default=str(CHECKOUT / ".journal" / "screens" / "screen.png"), help="where the picture is saved")
    return parser.parse_args()


def fixture_class(name: str) -> type:
    module, class_name = name.split(":")
    return getattr(importlib.import_module(module), class_name)


def take_picture(address: str, options: argparse.Namespace, output: Path) -> None:
    environment = {**os.environ, "CHROMIUM_PATH": os.environ.get("CHROMIUM_PATH", DEFAULT_CHROME)}
    finished = subprocess.run(["node", LOOK_SCRIPT, address, options.window, str(output), options.wait_for],
                              cwd=VIEWER_FOLDER, capture_output=True, text=True, timeout=SCREENSHOT_SECONDS, env=environment)
    if finished.returncode != 0:
        sys.exit(f"the browser failed:\n{finished.stdout}{finished.stderr}")


def main() -> None:
    options = arguments()
    output = Path(options.output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    folder = Path(tempfile.mkdtemp())
    try:
        (folder / "templates").mkdir()
        databases = TemplateDatabases(folder / "templates")
        story = databases.story(folder / "journal", (), fixture_class(options.fixture))
        try:
            for line in (TOUR_SETTING, *options.setup):
                outcome = story.run(line)
                if outcome.code != 0:
                    sys.exit(f"{line} gave {outcome.code}: {outcome.output_text}")
            with server_story(story) as served:
                address = f"http://127.0.0.1:{served.viewer_port()}/?key={served.viewer_key(LOGIN_NAME)}&environment=main"
                take_picture(address, options, output)
        finally:
            story.close()
    finally:
        shutil.rmtree(folder, ignore_errors=True)
    print(output)


main()
