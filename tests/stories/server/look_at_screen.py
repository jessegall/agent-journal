import subprocess
import sys
from pathlib import Path

CHECKOUT = Path(__file__).resolve().parents[3]
PNG_HEADER = b"\x89PNG\r\n\x1a\n"


def test_the_script_saves_a_screenshot_of_a_window_and_prints_its_path(tmp_path):
    picture = tmp_path / "agents.png"
    finished = subprocess.run([sys.executable, "scripts/look_at_screen.py", "--window", "agents.agents", "--output", str(picture)],
                              cwd=CHECKOUT, capture_output=True, text=True, timeout=120)
    assert finished.returncode == 0, finished.stdout + finished.stderr
    assert finished.stdout.strip() == str(picture)
    assert picture.read_bytes().startswith(PNG_HEADER)
