import re
from pathlib import Path

import features

HERE = Path(__file__).resolve().parents[1]
LINES = 150


def kept(name: str) -> list[Path]:
    return sorted(p for p in (HERE / "features" / name).glob("*.py") if p.stem == "test" or p.stem.startswith("test_"))


def test_a_feature_keeps_one_test_file_beside_itself_and_it_stays_small():
    features.load()
    too_many = {name: [p.name for p in kept(name)] for name in features.names() if len(kept(name)) > 1}
    assert too_many == {}, "a feature is allowed one test file, named test.py"
    too_long = {name: len(kept(name)[0].read_text().splitlines()) for name in features.names()
                if kept(name) and len(kept(name)[0].read_text().splitlines()) > LINES}
    assert too_long == {}, f"a feature's test file stays under {LINES} lines; what needs more than that belongs in the generated run"


ALLOWED = {"test_every_action.py", "test_the_gate.py", "test_the_suite.py"}


def test_outside_the_features_only_the_generated_runs_are_tests():
    found = sorted(p.relative_to(HERE).as_posix() for p in (HERE / "tests").rglob("test*.py") if p.name not in ALLOWED)
    assert found == [], "a test lives beside its feature as features/<name>/test.py, or it is one of the generated runs"


CLIENT = HERE / "web" / "src" / "api"
ROUTER = HERE / "web" / "src" / "route.js"
ENDPOINTS = re.compile(r"""\bfetch\(|new EventSource\(|["'`]/api\b|["'`]/\$\{|["'`]/(?:journals|services|plugins|pages|manifest|identity|agents|agent-hooks|agent-controls|upstream|upgrade|stop|extension|summary)\b""")


def test_only_the_api_client_names_an_endpoint():
    found = [f"{p.relative_to(HERE)}:{n}" for p in sorted((HERE / "web" / "src").rglob("*")) if p.suffix in (".js", ".vue", ".ts")
             and CLIENT not in p.parents and p != ROUTER for n, line in enumerate(p.read_text().splitlines(), 1) if ENDPOINTS.search(line)]
    assert found == [], "every request, path and stream belongs to web/src/api; nothing else writes one"
