import pytest

import features
from controllers.types import Notices
from engine.services import status_file
from engine.stored import write_json
from features import FEATURES
from features.plugins import services
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_service_that_gives_up_is_said_once_with_its_log_and_closes_when_it_returns():
    record = fresh("main")
    root = record.root
    enabled = FEATURES["plugins"].enabled

    write_json(status_file(root, "works.web"), {"state": "failed", "why": "it stopped 5 times within 60 seconds"})
    assert services.told(root, enabled) == ["works.web"], "the first look says it"
    told = Notices(record).all()[0]
    assert (told.title, "5 times" in told.brief, "service-works.web.log" in told.brief, told.data["tone"]) == \
        ("Service works.web is not running", True, True, "warn"), "the notice names the service, why, and where its log is"
    assert (services.told(root, enabled), len(Notices(record).all())) == ([], 1), "it is not said twice"

    write_json(status_file(root, "works.queue"), {"state": "blocked", "why": "port 8000 is in use"})
    assert services.told(root, enabled) == ["works.queue"], "a blocked service is said too"

    write_json(status_file(root, "works.web"), {"state": "ready"})
    services.told(root, enabled)
    assert (bool(Notices(record).load(told.n).completed), Notices(record).load(told.n).outcome) == (True, "it is running again"), \
        "the notice for a service that came back is closed"
    assert len([n for n in Notices(record).all() if not n.completed]) == 1, "and the one still blocked stays open"

    record.set_setting("features", {"services": False})
    write_json(status_file(root, "works.third"), {"state": "failed", "why": "no"})
    assert services.told(root, enabled) == ["works.third"], "services are watched even with the feature switched off in settings"
