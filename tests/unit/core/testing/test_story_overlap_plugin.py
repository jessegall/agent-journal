import pytest
from tests.unit.core.testing.support.overlap_cases import configure_run

pytest_plugins = ["pytester"]

def test_shared_story_steps_fail_pytest_as_a_named_failure(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::shared_first_steps" in pytest_run.stdout.str()
    assert "test_first" in pytest_run.stdout.str() and "test_second" in pytest_run.stdout.str()


def test_shared_story_steps_on_different_workers_fail_pytest(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short", "-n", "2", "--maxschedchunk=1")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::shared_first_steps" in pytest_run.stdout.str()
    assert "test_first" in pytest_run.stdout.str() and "test_second" in pytest_run.stdout.str()


def test_shared_setup_in_a_fixture_passes_pytest(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared='''
from core.testing.story_fixture import StoryFixture

class AdaExists(StoryFixture):
    def steps(self, story):
        story.expect_success('actor make user "Ada"')
        story.expect_success('actor list')

def test_first(new_story):
    story = new_story(fixture=AdaExists)
    story.expect_success('actor list')

def test_second(new_story):
    story = new_story(fixture=AdaExists)
    story.expect_success('actor show 1')
''')
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.OK
    pytest_run.assert_outcomes(passed=2)
