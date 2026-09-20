import features
import pytest
from controllers.types import Notifications
from surfaces.updates import announce, newer
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_new_version_is_announced_once():
    record = fresh("main")
    assert (announce(record.root, "2.10.0"), Notifications(record).all()) == ("", []), \
        "a first install only notes its version"
    assert announce(record.root, "2.10.0") == "", "the same version again says nothing"
    assert announce(record.root, "2.11.0") == "2.11.0", "a new version is announced"
    told = Notifications(record).all()[-1]
    assert (told.title, told.data.get("kind"), told.brief) == ("Journal updated to 2.11.0", "update", "The journal went from 2.10.0 to 2.11.0."), \
        "as a notification marked as an update, naming both versions"
    assert (announce(record.root, "2.11.0"), len(Notifications(record).all())) == ("", 1), "and only once"


def test_a_version_is_newer_only_when_a_part_of_it_is_bigger():
    assert [newer(a, b) for a, b in (("2.13.0", "2.9.4"), ("2.9.4", "2.13.0"), ("2.13.0", "2.13.0"), ("2.13.1", "2.13.0"), ("", "2.13.0"), ("x.y", "2.13.0"))] == \
        [True, False, False, True, False, False]
