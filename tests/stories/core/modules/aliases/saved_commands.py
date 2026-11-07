import json
from collections.abc import Iterator

import pytest

from core.base.agent_role import AgentRole
from core.base.driver.classification import Classification
from core.base.driver.command_category import CommandCategory
from core.base.driver.part import Part
from core.modules.aliases.rules.saved_command_rule import SavedCommandRule
from core.modules.processes.support.runner_line import READ_FLAGS_VARIABLE
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.alias_hook import AliasHook
from tests.stories.server.support.server_client import server_story

REGISTER = 'alias add build-npm "npm run build" --category build'


class BuildSaved(StoryFixture):
    """The project has saved its build as journal build-npm."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.expect_success(REGISTER, actor=story.agent)
        story.run_listeners()


def hook_of(story: Story, saved_lines: dict[str, str]) -> Iterator[AliasHook]:
    install_runner(story)
    with server_story(story) as server:
        story.home.saved_command_file.parent.mkdir(parents=True, exist_ok=True)
        story.home.alias_file.write_text(json.dumps(saved_lines))
        story.home.saved_command_file.write_text(json.dumps(list(saved_lines)))
        yield AliasHook(server)


@pytest.fixture
def unsaved_hook(new_story):
    yield from hook_of(new_story(fixture=BuilderStarted), {})


@pytest.fixture
def saved_hook(new_story):
    yield from hook_of(new_story(fixture=BuildSaved), {"build-npm": "npm run build"})


def expect_read_flag(hook: AliasHook, line: str, expanded: str, read_flag: str) -> None:
    assert f"{READ_FLAGS_VARIABLE}={read_flag}" in hook.expect_expanded(line, expanded)


def expect_saved_names(story: Story, names: list[str]) -> None:
    assert story.home.saved_command_file.exists(), story.system_log_text()
    assert sorted(json.loads(story.home.saved_command_file.read_text())) == names


def expect_helper_refusal(story: Story, text: str) -> None:
    part = Part("make all", "make", "", (), Classification(CommandCategory.BUILD, ()), (), (), "", None)
    refusal = story.container.get(SavedCommandRule).refusal(part, AgentRole.HELPER)
    assert refusal is not None and text in refusal.text


def test_an_unknown_build_is_stopped_and_told_how_to_register_it(unsaved_hook):
    unsaved_hook.expect_denied("npm run build 2>&1 | tail -5", 'save this command as an alias of category build')


def test_a_skip_at_the_head_of_a_line_lets_it_run_as_written(unsaved_hook):
    unsaved_hook.expect_expanded('journal alias skip --reason "one run" && npm run build', 'journal alias skip --reason "one run" && npm run build')


def test_a_saved_build_refuses_the_command_written_out(saved_hook):
    saved_hook.expect_denied("npm run build", "this runs through a saved command: journal build-npm --tail 20")


def test_a_build_written_another_way_is_told_the_saved_builds(saved_hook):
    saved_hook.expect_denied("make all", 'use a saved build with --tail, --head or --cut')


def test_a_test_or_build_is_refused_beside_any_other_command(saved_hook):
    saved_hook.expect_denied("journal build-npm --tail 5 && git commit -m done", "a test or build runs on a line of its own")
    saved_hook.expect_denied("git status && journal build-npm --tail 5", "a test or build runs on a line of its own")


def test_two_saved_builds_run_on_one_line(saved_hook):
    saved_hook.expect_allowed("journal build-npm --tail 5 && journal build-npm --tail 1")


def test_a_skip_is_refused_when_a_command_of_that_kind_is_saved(saved_hook):
    saved_hook.expect_denied('journal alias skip --reason "one run" && npm run build', "this runs through a saved command: journal build-npm --tail 20")
    saved_hook.expect_denied('journal alias skip --reason "one run" && make all', "use a saved build")


def test_a_helper_is_told_to_ask_its_parent(new_story):
    story = new_story(fixture=BuilderStarted)
    expect_helper_refusal(story, "a helper only reads: ask your parent to save an alias for this build")


def test_saving_a_build_writes_its_name_for_the_hook(new_story):
    story = new_story(fixture=BuildSaved)
    story.expect_success('alias add unit-tests "pytest tests/unit" --category "test run"', actor=story.agent)
    story.run_listeners()
    expect_saved_names(story, ["build-npm", "unit-tests"])


def test_each_alias_with_a_category_writes_its_category_for_the_hook(new_story):
    story = new_story(fixture=BuildSaved)
    story.expect_success('alias add sins ".journal/plugins/judge/bin/judge --changes" --category check', actor=story.agent)
    story.expect_success('alias add notes "cat notes.md"', actor=story.agent)
    story.run_listeners()
    assert json.loads(story.home.alias_category_file.read_text()) == {"build-npm": "build", "sins": "check"}


def test_a_saved_build_refuses_a_pipe(saved_hook):
    saved_hook.expect_denied("journal build-npm --tail 5 | head -1", "journal build-npm takes no pipe")


def test_a_saved_build_refuses_a_run_with_no_reading_flag(saved_hook):
    saved_hook.expect_denied("journal build-npm", "journal build-npm needs --tail, --head or --cut A-B")


def test_a_saved_build_runs_bare_with_its_arguments_and_its_reading_goes_to_the_runner(saved_hook):
    expect_read_flag(saved_hook, "journal build-npm --mode demo --tail 5", "npm run build --mode demo", "1:tail:5")


def test_a_saved_build_answers_a_question_about_itself_with_no_reading_flag(saved_hook):
    saved_hook.expect_expanded("journal build-npm --version", "npm run build --version")


def test_a_failed_test_fails_its_run_whatever_came_after_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "npm test; echo done", category=CommandCategory.TEST_RUN)
    story.expect_success(f"process part-end {process.id} --position 1 --exit-code 3", actor=story.agent)
    story.expect_success(f"process end {process.id} --exit-code 0 --bytes 0 --lines 0", actor=story.agent)
    story.expect_text(f"process show {process.id}", "state: failed", "exit_code: 3", actor=story.agent)


def test_an_alias_becomes_a_saved_command_by_its_category(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('alias add unit-tests "pytest tests/unit"', actor=story.agent)
    story.expect_success('alias edit unit-tests --category "test run"', actor=story.agent)
    story.expect_text("alias show 1", "category: test run", actor=story.agent)


def test_a_line_naming_a_worktree_is_not_saved(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('alias add build-tree ".journal/worktrees/main/worker-1/build.sh" --category build', "cannot contain a temporary worktree path", actor=story.agent)
