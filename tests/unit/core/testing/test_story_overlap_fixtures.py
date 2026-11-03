import pytest

from tests.unit.core.testing.support.overlap_cases import configure_run

pytest_plugins = ["pytester"]


def test_common_setup_in_a_pytest_fixture_is_not_a_story_prefix(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared='''
import pytest

@pytest.fixture
def user_exists(new_story):
    story = new_story()
    story.expect_success('actor make user "Ada"')
    story.expect_success('actor list')
    return story

def test_first(user_exists):
    user_exists.expect_success('actor list')

def test_second(user_exists):
    user_exists.expect_success('actor show 1')
''')
    result = pytester.runpytest_subprocess("-q", "--tb=short")
    assert result.ret == pytest.ExitCode.OK
    result.assert_outcomes(passed=2)
