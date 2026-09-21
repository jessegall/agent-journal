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
