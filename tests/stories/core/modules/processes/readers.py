import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.processes.commands.add_reader.add_reader import AddReader
from tests.stories.core.modules.processes.support.process_samples import ended_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row

TESTS_READER = 'reader add tests --commands "pytest*" --lines "FAILED|passed|failed" --finished "passed" --failed "failed|error" --summary "([0-9]+ passed.*)"'


def module_actor(story, name: str) -> Actor:
    row = story.container.get(Database).rows(Statement("SELECT id FROM actors WHERE type = 'module' AND name = ?", [name]))[0]
    return Actor(row["id"], ActorType.MODULE)


def test_a_reader_is_added_by_a_pattern_of_lines(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(TESTS_READER, "name: tests", "type: pattern", "commands: pytest*", "lines_pattern: FAILED|passed|failed", actor=story.agent)


def test_a_reader_is_added_by_a_script_of_the_project(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add makes --commands "make*" --script scripts/read_make.sh', "type: script", "script: scripts/read_make.sh", actor=story.agent)


def test_adding_a_reader_again_keeps_each_field_the_flags_leave_out(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(f'{TESTS_READER} --title "Tests"', actor=story.agent)
    story.expect_success('reader add tests --commands "pytest*" --lines "FAILED"', "title: Tests", "lines_pattern: FAILED", "finished_pattern: passed", actor=story.agent)
    story.expect_text("reader list", "tests")


def test_a_reader_made_the_default_of_its_commands_takes_the_place_of_the_one_that_was(new_story):
    story = new_story(fixture=BuilderStarted)
    first = story.new_row_id('reader add first --commands "tox*" --lines "FAILED"', actor=story.agent)
    second = story.new_row_id('reader add second --commands "tox*" --lines "error"', actor=story.agent)
    story.run("reader default first", actor=story.agent)
    story.run("reader default second", actor=story.agent)
    story.expect_text(f"reader show {first}", "name: first")
    story.expect_absent(f"reader show {first}", "is_default: True")
    story.expect_text(f"reader show {second}", "is_default: True")


def test_a_reader_another_modules_actor_made_is_not_removed_by_an_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    story.container.get(Bus).run(AddReader("built-in", "make*", lines="error"), module_actor(story, "journal.core.processes"), environment_id=1)
    story.expect_refusal("reader remove built-in", "made by journal.core.processes", actor=story.agent)
    story.run(TESTS_READER, actor=story.agent)
    story.expect_text("reader remove tests", "deleted: reader:", actor=story.agent)
    story.expect_text("reader list", "built-in")


def test_a_journal_commands_own_output_is_never_read_by_a_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add every --commands "*" --lines "state"', actor=story.agent)
    process = ended_run(story, "journal task show 1", "state: open\ntitle: Fix\n")
    story.expect_absent(f"output read {process.id} --summary", "1: state: open", actor=story.agent)
    second_output = ended_run(story, "cat notes", "state: kept\n")
    story.expect_text(f"output read {second_output.id} --summary", "1: state: kept", actor=story.agent)


def test_the_shipped_pytest_reader_reads_a_pytest_output(new_story):
    story = new_story(fixture=BuilderStarted)
    report = "collected 3 items\n.F. [100%]\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n2 failed, 1 passed in 0.4s\n"
    process = ended_run(story, "pytest -q tests", report, exit_code=1)
    story.expect_text(f"output read {process.id} --summary", f"output {process.id} failed with exit code 1", "3: FAILED tests/test_cart.py::test_total - assert 1 == 2", "summary: 2 failed, 1 passed", actor=story.agent)
    story.expect_refusal("reader remove pytest", "was made by", actor=story.agent)


def run_title(story, line):
    process = ended_run(story, line, "")
    return json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)["title"]


def test_a_run_keeps_the_title_of_its_reader_with_its_topic(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add merges --commands "merge*" --lines "done" --topic "merge +([0-9]+)" --title "Merging worker {topic}"', actor=story.agent)
    story.run('reader add deploys --commands "deploy*" --lines "done" --topic "deploy +(\\w+)" --title "Deploying"', actor=story.agent)
    expect_run_title(story, "merge 3", "Merging worker 3")
    expect_run_title(story, "deploy staging", "Deploying: staging")


def test_a_run_with_no_reader_never_shows_its_raw_line_as_its_title_until_the_agent_gives_one(new_story):
    story = new_story(fixture=BuilderStarted)
    process = ended_run(story, "./deploy.sh --with secret", "uploading\n")
    expect_title_without(story, f"process card {process.id} --json", "secret")
    story.run(f'output title {process.id} "Deploying the site"', actor=story.agent)
    expect_row(json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text), title="Deploying the site")


def test_a_reader_counts_the_steps_of_a_run_and_keeps_them_on_its_output(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(f'{TESTS_READER} --step "[.FE]" --subject "the failed tests" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    process = ended_run(story, "pytest -q", "tests/a.py ...F. [ 50%]\ntests/b.py ..E. [100%]\n1 failed, 6 passed\n")
    story.run(f"output read {process.id} --summary", actor=story.agent)
    card = json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)
    expect_row(card, steps_passed=7, steps_failed=2)


def test_a_reader_with_a_pattern_that_does_not_compile_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('reader add broken --commands "make*" --lines "ok" --topic "("', "--topic pattern that does not compile", actor=story.agent)


def test_a_count_pattern_is_checked_and_its_fields_survive_an_update(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('reader add broken --commands "make*" --lines "ok" --count "("', "--count pattern that does not compile", actor=story.agent)
    story.expect_success('reader add counted --commands "make*" --lines "ok" --count "collected ([0-9]+)" --count-command "{part} --list"', actor=story.agent)
    story.expect_success('reader add counted --title "Running tests"', "count_pattern: collected ([0-9]+)", "count_command: {part} --list", actor=story.agent)


def expect_run_title(story, line, expected) -> None:
    actual = run_title(story, line)
    assert actual == expected, actual


def expect_title_without(story, text, expected) -> None:
    actual = json.loads(story.run(text, actor=story.agent).output_text)['title']
    assert expected not in actual, actual
