import subprocess
import sys
from pathlib import Path
from tests.stories.support.story_checks import expect_value

CHECKOUT = Path(__file__).resolve().parents[3]
PNG_HEADER = b"\x89PNG\r\n\x1a\n"


def test_the_script_saves_a_screenshot_of_a_window_and_prints_its_path(tmp_path):
    image = tmp_path / "agents.png"
    finished = subprocess.run([sys.executable, "scripts/look_at_screen.py", "--window", "agents.agents", "--output", str(image)],
                              cwd=CHECKOUT, capture_output=True, text=True, timeout=120)
    expect_value(finished.returncode, 0)
    expect_value(finished.stdout.strip(), str(image))
    expect_value(bool(image.read_bytes().startswith(PNG_HEADER)), True)
