import pytest

from tests.unit.engine.testing.support.overlap_cases import configure_hooks, configure_run

pytest_plugins = ["pytester"]


def test_hooks_that_differ_only_in_their_file_are_the_same_story_path(pytester, monkeypatch):
    configure_hooks(pytester, monkeypatch, "tax.py")
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "100% of their steps" in pytest_run.stdout.str()


def test_hooks_of_another_type_before_identical_reads_are_another_story_path(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared='''
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined

def test_first(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit("cart.py"))
    story.expect_success("actor list")
    story.expect_success("actor list")

def test_second(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.prompt("hello"))
    story.expect_success("actor list")
    story.expect_success("actor list")
''')
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.OK
    pytest_run.assert_outcomes(passed=2)


def test_identical_hooks_are_detected_despite_generated_firing_ids(pytester, monkeypatch):
    configure_hooks(pytester, monkeypatch, "cart.py")
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::overlapping_steps" in pytest_run.stdout.str()


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
