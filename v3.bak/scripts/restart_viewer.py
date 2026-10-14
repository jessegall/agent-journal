import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".journal" / "src"))
from engine.viewer import restart  # noqa: E402

print(restart(ROOT / ".journal", ROOT) or "the viewer did not come back; see .journal/runtime/viewer.log")
