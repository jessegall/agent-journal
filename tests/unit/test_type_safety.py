import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PYRIGHT = ROOT / ".venv" / "bin" / "pyright"
TIMEOUT_SECONDS = 300


def test_the_core_type_checks_clean_under_pyright_strict():
    finished = subprocess.run([str(PYRIGHT), "--outputjson"], cwd=ROOT, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    report = json.loads(finished.stdout)
    errors = [f"{item['file'].removeprefix(str(ROOT) + '/')}:{item['range']['start']['line'] + 1}: {item['message']}"
              for item in report["generalDiagnostics"] if item["severity"] in ("error", "warning")]
    assert not errors, "\n".join(errors)
