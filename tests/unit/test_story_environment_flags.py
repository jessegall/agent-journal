import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "checks" / "story_environment_flags.py"
specification = importlib.util.spec_from_file_location("story_environment_flags", SCRIPT)
flags = importlib.util.module_from_spec(specification)
specification.loader.exec_module(flags)


def test_a_command_naming_the_environment_its_story_runs_in_is_found():
    source = '''
def test_a_story(new_story):
    story = new_story(fixture=Fixture, environment="main")
    story.expect_success("task list --environment main")
    story.expect_success("task list --environment elsewhere")
    story.expect_success(f"task show {1} --environment main")
'''
    assert [(flag.line, flag.environment) for flag in flags.own_environment_flags(source)] == [(4, "main"), (6, "main")]


def test_a_story_that_names_no_environment_has_nothing_repeated():
    source = '''
def test_a_story(new_story):
    story = new_story(fixture=Fixture)
    story.expect_success("task list --environment main")
'''
    assert flags.own_environment_flags(source) == []


def test_a_sweep_names_the_environment_once_and_clears_the_commands():
    source = '''
def test_a_story(new_story):
    story = new_story(fixture=Fixture)
    story.expect_success("task list --environment main --json")
    story.expect_success(f'task show {1} --environment main')
    story.expect_success("task list --environment elsewhere")
'''
    assert flags.swept(source) == '''
def test_a_story(new_story):
    story = new_story(fixture=Fixture, environment="main")
    story.expect_success("task list --json")
    story.expect_success(f'task show {1}')
    story.expect_success("task list --environment elsewhere")
'''


def test_a_sweep_leaves_a_fixture_a_story_without_the_flag_and_a_story_in_another_environment_alone():
    source = '''
class Fixture(StoryFixture):
    def steps(self, story):
        story.run("task make Cart --environment main")


def test_without_the_flag(new_story):
    story = new_story()
    story.run("task list")


def test_elsewhere(new_story):
    story = new_story(environment="elsewhere")
    story.run("task list --environment main")
'''
    assert flags.swept(source) == source


def test_a_sweep_keeps_what_is_not_ascii_where_it_is():
    source = '''
def test_a_story(new_story):
    story = new_story()
    story.run("message send été --environment main")
'''
    assert flags.swept(source) == source.replace("new_story()", 'new_story(environment="main")').replace(" --environment main", "")


def test_a_sweep_leaves_a_string_that_is_not_a_command_line_as_it_is():
    source = '''
def test_a_story(new_story):
    story = new_story()
    story.expect_refusal(CRITIQUE.replace(" --environment main", ""), "belongs")
    story.run("task list --environment main")
'''
    assert flags.swept(source) == '''
def test_a_story(new_story):
    story = new_story(environment="main")
    story.expect_refusal(CRITIQUE.replace(" --environment main", ""), "belongs")
    story.run("task list")
'''


def test_a_sweep_adds_the_environment_to_each_story_of_a_function():
    source = '''
def test_two_stories(new_story):
    first = new_story(fixture=One)
    second = new_story(fixture=Two,
                       modules=("x",))
    first.run("task list --environment main")
'''
    result = flags.swept(source)
    assert result.count('environment="main"') == 2 and "--environment" not in result
