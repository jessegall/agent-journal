from core.testing.story_fixture import StoryFixture
from core.testing.template_requests import TemplateRequests


class RequestedFixture(StoryFixture):
    pass


SAMPLE_MODULES = tuple(["sample:Module"])
EMPTY_MODULES = tuple(["sample:Empty"])
REQUESTED_FIXTURES = tuple([RequestedFixture])


def test_noted_template_lists_single_entry(tmp_path):
    requests = TemplateRequests(tmp_path / "requests")
    requests.add(SAMPLE_MODULES, RequestedFixture)
    requests.add(SAMPLE_MODULES, RequestedFixture)
    requests.add(EMPTY_MODULES, None)
    assert requests.listed(REQUESTED_FIXTURES) == [(SAMPLE_MODULES, RequestedFixture), (EMPTY_MODULES, None)]


def test_missing_fixture_skipped(tmp_path):
    requests = TemplateRequests(tmp_path / "requests")
    requests.add(SAMPLE_MODULES, RequestedFixture)
    assert requests.listed(()) == []


def test_absent_file_empty_list(tmp_path):
    assert TemplateRequests(tmp_path / "requests").listed(REQUESTED_FIXTURES) == []
