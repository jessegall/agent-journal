import pytest

from tests.unit.core.testing.support.overlap_cases import configure_hooks, configure_run

pytest_plugins = ["pytester"]


def test_different_hooks_before_identical_reads_are_different_story_steps(pytester, monkeypatch):
    configure_hooks(pytester, monkeypatch, "tax.py")
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.OK
    pytest_run.assert_outcomes(passed=2)


def test_identical_hooks_are_detected_despite_generated_firing_ids(pytester, monkeypatch):
    configure_hooks(pytester, monkeypatch, "cart.py")
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::shared_first_steps" in pytest_run.stdout.str()


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
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.OK
    pytest_run.assert_outcomes(passed=2)
