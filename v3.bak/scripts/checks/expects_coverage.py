"""Coverage of src by the generated runs and the features' own tests, per feature and as a whole; a release needs 95 percent. The slow suites stay out, since under coverage they never end."""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "src"
FEATURES = SRC / "features"
GATE = 95.0
RUNS = ("tests/test_the_expectations.py", "tests/test_every_action.py", "tests/test_the_gate.py", "tests/test_the_catalogue.py", "src/features")
EACH_TEST_SECONDS = 180


def measured(report: Path) -> dict:
    """The coverage report of one run of the quick suites and the features' tests over src."""
    subprocess.run([sys.executable, "-m", "pytest", "-q", "--timeout", str(EACH_TEST_SECONDS), f"--cov={SRC}", "--cov-report", f"json:{report}", *RUNS],
                   cwd=ROOT, check=False)
    return json.loads(report.read_text())


def percent(covered: int, statements: int) -> float:
    return 100.0 if not statements else 100.0 * covered / statements


def per_feature(files: dict) -> dict[str, float]:
    """Each feature's share of its own statements the runs reached."""
    totals: dict[str, list[int]] = {}
    for path, data in files.items():
        relative = Path(path).resolve().relative_to(SRC)
        if relative.parts[0] != "features" or len(relative.parts) < 3 or relative.name == "test.py":
            continue
        counted = totals.setdefault(relative.parts[1], [0, 0])
        counted[0] += data["summary"]["covered_lines"]
        counted[1] += data["summary"]["num_statements"]
    return {name: percent(*counted) for name, counted in sorted(totals.items())}


def main() -> int:
    with tempfile.TemporaryDirectory() as scratch:
        report = measured(Path(scratch) / "coverage.json")
    whole = report["totals"]["percent_covered"]
    below = {name: share for name, share in per_feature(report["files"]).items() if share < GATE}
    print(f"src as a whole: {whole:.1f} percent")
    for name, share in below.items():
        print(f"{name}: {share:.1f} percent, below {GATE:.0f}")
    return 0 if whole >= GATE and not below else 1


if __name__ == "__main__":
    sys.exit(main())
