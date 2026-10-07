import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))

from tests import isolation  # noqa: E402

isolation.settle()

import pytest  # noqa: E402

import features  # noqa: E402


@pytest.fixture(scope="module", autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()
