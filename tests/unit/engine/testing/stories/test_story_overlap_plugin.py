import pytest
from tests.unit.engine.testing.support.overlap_cases import configure_run

pytest_plugins = ["pytester"]

def test_shared_story_steps_fail_pytest_as_a_named_failure(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::overlapping_steps" in pytest_run.stdout.str()
    assert "test_first" in pytest_run.stdout.str() and "test_second" in pytest_run.stdout.str()


def test_shared_story_steps_on_different_workers_fail_pytest(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short", "-n", "2", "--maxschedchunk=1")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    pytest_run.assert_outcomes(passed=2, failed=1)
    assert "stories::overlapping_steps" in pytest_run.stdout.str()
    assert "test_first" in pytest_run.stdout.str() and "test_second" in pytest_run.stdout.str()


def test_shared_setup_in_a_fixture_passes_pytest(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared='''
from engine.testing.stories.story_fixture import StoryFixture

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


def test_a_run_of_the_whole_suite_prints_its_wall_and_cpu_seconds_in_its_summary(pytester, monkeypatch, tmp_path):
    configure_run(pytester, monkeypatch)
    record = tmp_path / "runtime" / "full-test-runs.jsonl"
    record.parent.mkdir()
    monkeypatch.setenv("JOURNAL_FULL_RUN_RECORD", str(record))
    pytester.makepyfile(**{"tests/test_plain": "def test_plain():\n    assert sum(range(100000)) > 0\n"})
    pytest_run = pytester.runpytest_subprocess("tests", "-q", "-n", "2", "--maxschedchunk=1")
    assert "wall seconds," in pytest_run.stdout.str() and "cpu seconds in the test runners" in pytest_run.stdout.str()
    assert '"cpu_seconds": ' in record.read_text()


def test_stories_of_no_fixture_are_counted_and_do_not_fail_a_run_that_only_counts(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared='''
def test_first(new_story):
    story = new_story()
    story.expect_success('actor list')

def test_second(new_story):
    story = new_story()
    story.expect_success('actor show 1')
''')
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.OK
    assert "stories starting from no fixture: 2, groups of stories sharing their first steps across files: 0, fixtures adding no step: 0" in pytest_run.stdout.str()


def test_a_story_of_no_fixture_fails_a_run_that_asks_for_the_rule_and_names_a_fixture(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makeini("[pytest]\nstory_fixture_rules = fail\n")
    pytester.makepyfile(test_shared='''
def test_first(new_story):
    story = new_story()
    story.expect_success('actor list')
''')
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    assert "story starts from no fixture" in pytest_run.stdout.str() and "test_first" in pytest_run.stdout.str()


def test_stories_of_two_files_with_the_same_opening_fail_a_run_that_asks_for_the_rule(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makeini("[pytest]\nstory_fixture_rules = fail\n")
    opening = "    story.expect_success('actor list')\n    story.expect_success('actor show 1')\n    story.expect_success('actor list --json')\n"
    pytester.makepyfile(test_one="from engine.testing.stories.story_fixture import StoryFixture\n\nclass Start(StoryFixture):\n    def steps(self, story):\n        story.expect_success('actor list')\n\n"
                        f"def test_one(new_story):\n    story = new_story(fixture=Start)\n{opening}    story.expect_success('task list')\n",
                        test_two="from test_one import Start\n\n"
                        f"def test_two(new_story):\n    story = new_story(fixture=Start)\n{opening}    story.expect_success('plan list')\n")
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    assert "share their first 3 steps, move them into a fixture" in pytest_run.stdout.str()


def test_a_fixture_with_no_step_fails_a_run_that_asks_for_the_rule(pytester, monkeypatch):
    configure_run(pytester, monkeypatch)
    pytester.makeini("[pytest]\nstory_fixture_rules = fail\n")
    pytester.makepyfile(test_shared='''
from engine.testing.stories.story_fixture import StoryFixture

class Base(StoryFixture):
    def steps(self, story):
        story.expect_success('actor list')

class Empty(Base):
    parent = Base

    def steps(self, story):
        return None

def test_first(new_story):
    story = new_story(fixture=Empty)
    story.expect_success('actor show 1')
''')
    pytest_run = pytester.runpytest_subprocess("-q", "--tb=short")
    assert pytest_run.ret == pytest.ExitCode.TESTS_FAILED
    assert "fixture adds no step to Base" in pytest_run.stdout.str() and "Empty" in pytest_run.stdout.str()
