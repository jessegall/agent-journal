import pytest

from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases
from tests.core import fixtures

FIXTURES = tuple(fixture for fixture in StoryFixture.declared() if fixture.__module__ == fixtures.__name__)


@pytest.mark.parametrize("fixture", FIXTURES, ids=lambda fixture: fixture.__name__)
def test_every_fixture_builds_and_meets_what_it_expects(tmp_path, fixture: type[StoryFixture]):
    TemplateDatabases(tmp_path).template((), fixture)
