import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))

from tests import isolation  # noqa: E402

isolation.settle()

import pytest  # noqa: E402

import features  # noqa: E402


@pytest.fixture(autouse=True)
def work_in_the_test_thread(monkeypatch):
    import engine.bus as bus
    monkeypatch.setattr(bus, "BACKGROUND", False)


@pytest.fixture(scope="module", autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()
