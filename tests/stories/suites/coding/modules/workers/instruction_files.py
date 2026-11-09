import pytest
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.support.story_checks import expect_value

PROJECT_TEXT = "The project's own briefing.\n"
PLUGIN_TEXT = "Run the commandments before you hand in."
BLOCK = [{"key": "briefing", "title": "Inject our briefing into the agent file", "file": "briefing.md"}]
NOTES_PROFILE = 'profile save notes-worker --type worker --description "Works through notes" --body "Work through the notes." --keeps-project-instructions --injections \'{"journal": false}\''


def project_with_instructions(story: Story):
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("CLAUDE.md", PROJECT_TEXT, "the project's Claude file")
    repository.committed("AGENTS.md", PROJECT_TEXT, "the project's agent file")
    return repository


def worktree_file_text(repository, worker, name: str) -> str:
    return (repository.worktree_folder(worker.id) / name).read_text()


@pytest.mark.real_git
def test_a_worker_s_worktree_gets_instruction_files_for_its_profile_and_not_the_project_s(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    worker = dispatched_worker(story)
    for name in ("CLAUDE.md", "AGENTS.md"):
        text = worktree_file_text(repository, worker, name)
        expect_value(bool("You are a worker" in text and PROJECT_TEXT not in text), True)
    expect_value(bool((repository.worktree_folder(worker.id) / "CLAUDE.original.md").exists()), False)
    repository.expect_clean(worker.id)


@pytest.mark.real_git
def test_a_profile_keeps_the_project_s_files_beside_its_own_when_it_says_so(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    story.expect_success(NOTES_PROFILE, actor=story.user)
    worker = dispatched_worker(story, DISPATCH.replace("--model sonnet", "--model sonnet --profile notes-worker"))
    text = worktree_file_text(repository, worker, "AGENTS.md")
    expect_value(bool("Work through the notes." in text and "You are a worker" not in text), True)
    expect_value(worktree_file_text(repository, worker, "AGENTS.original.md"), PROJECT_TEXT)
    expect_value(worktree_file_text(repository, worker, "CLAUDE.original.md"), PROJECT_TEXT)
    repository.expect_clean(worker.id)


def test_a_person_turns_the_instruction_files_off_and_the_worktree_keeps_the_project_s(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-instruction-files false --project", actor=story.user)
    worker = dispatched_worker(story)
    expect_value(worktree_file_text(repository, worker, "CLAUDE.md"), PROJECT_TEXT)


def test_a_plugin_s_block_is_shown_as_a_profile_switch_and_put_in_the_files_unless_the_profile_turns_it_off(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    folder = event_plugin_folder(story.home.folder.parent, [], {}, name="commandments", instruction_blocks=BLOCK)
    (folder / "briefing.md").write_text(PLUGIN_TEXT)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.expect_text("worker injections journal-worker", "commandments.briefing: Inject our briefing into the agent file: on", "journal: Inject the journal briefing: on", actor=story.user)
    expect_value(PLUGIN_TEXT in worktree_file_text(repository, dispatched_worker(story), "AGENTS.md"), True)
    story.expect_success('profile save notes-worker --type worker --description "Works through notes" --body "Work through the notes." --injections \'{"commandments.briefing": false}\'', actor=story.user)
    story.expect_text("worker injections notes-worker", "commandments.briefing: Inject our briefing into the agent file: off", actor=story.user)


@pytest.mark.real_git
def test_a_change_of_the_base_to_an_instruction_file_merges_into_a_worktree_that_holds_written_files(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    worker = dispatched_worker(story)
    repository.committed("AGENTS.md", "The base changed its agent file.\n", "the base changes the agent file")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    worktree = repository.worktree_folder(worker.id)
    expect_value("You are a worker" in worktree_file_text(repository, worker, "AGENTS.md"), True)
    expect_value(repository.git("show", "HEAD:AGENTS.md", folder=worktree).stdout, "The base changed its agent file.\n")
    repository.expect_clean(worker.id)


@pytest.mark.real_git
def test_a_worker_commit_that_touches_its_instruction_files_merges_without_changing_the_branch_s_copies(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = project_with_instructions(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    repository.changed(worker.id, "CLAUDE.md", "The worker rewrote its file.\n")
    repository.changed(worker.id, "AGENTS.md", "The worker rewrote its file.\n")
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_file(ENVIRONMENT_BRANCH, "CLAUDE.md", PROJECT_TEXT)
    repository.expect_file(ENVIRONMENT_BRANCH, "AGENTS.md", PROJECT_TEXT)


@pytest.mark.real_git
def test_a_send_reads_each_instruction_file_of_the_worktree_once(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    project_with_instructions(story)
    worker = dispatched_worker(story)
    story.expect_success(f'worker send --wait {worker.id} "Go on with the job"', actor=story.agent)
