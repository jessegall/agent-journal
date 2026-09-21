import pytest

import features


@pytest.fixture(scope="module", autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()
