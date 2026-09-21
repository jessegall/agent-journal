import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
LINES = 150
GENERATED = {"test_every_action.py", "test_the_gate.py", "test_it_boots.py"}


def kept(feature: Path) -> list[Path]:
    return sorted(p for p in feature.glob("*.py") if p.stem == "test" or p.stem.startswith("test_"))


def problems() -> list[str]:
    text = []
    for feature in sorted(p for p in (HERE / "features").iterdir() if (p / "feature.py").is_file()):
        tests = kept(feature)
        if len(tests) > 1:
            text.append(f"features/{feature.name} keeps {len(tests)} test files; a feature is allowed one, named test.py")
        if tests and len(tests[0].read_text().splitlines()) > LINES:
            text.append(f"features/{feature.name}/{tests[0].name} is over {LINES} lines; what needs more belongs in the generated runs")
    for stray in sorted((HERE / "tests").rglob("test*.py")):
        if stray.name not in GENERATED:
            text.append(f"{stray.relative_to(HERE)} is a test outside the features; tests/ holds only the generated runs")
    return text


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "every feature keeps one small test, and tests/ holds only the generated runs")
    sys.exit(1 if found else 0)
