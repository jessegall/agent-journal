from tests.stories.core.support.agent_labels import agent_number
import shlex

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from tests.stories.core.modules.processes.support.process_samples import expect_rewritten, install_runner, runner_line
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

SANDBOX_SETTING = "journal.suites.coding.workers.worker-sandbox"
READ = HookSamples.shell("cat cart.py", ShellPart("cat", CommandCategory.READ, ["cart.py"]))


def sandboxed_story(new_story) -> Story:
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    story.container.get(ShellSandbox).is_required = True
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


def test_the_project_setting_off_runs_a_workers_lines_without_the_sandbox(new_story):
    story = sandboxed_story(new_story)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"setting set {SANDBOX_SETTING} off --project", actor=story.user)
    session = worker_session(story, worker)
    story.run("task overview 1", actor=worker)
    expect_rewritten(story.hook(session, READ), runner_line(story, 1, "cat cart.py", limit=0, session=session, read_command=True))
    story.expect_text("process show 1", "sandbox_level: none")
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": true', actor=story.agent)


def test_a_worker_switched_back_on_runs_in_the_sandbox_again(new_story):
    story = sandboxed_story(new_story)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"worker sandbox {agent_number(story, worker.id)} off", actor=story.agent)
    story.expect_success(f"worker sandbox {agent_number(story, worker.id)} on", actor=story.user)
    session = worker_session(story, worker)
    story.run("task overview 1", actor=worker)
    expected = runner_line(story, 1, "cat cart.py", limit=0, session=session, read_command=True, sandbox=True)
    expected = expected.replace(" --read-only-shell", f" --read-only-shell --write-folder {shlex.quote(str(repository.worktree_folder(worker.id)))}")
    expect_rewritten(story.hook(session, READ), expected)
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": false', actor=story.agent)


def test_a_worker_switched_on_stays_in_the_sandbox_while_the_project_setting_is_off(new_story):
    story = sandboxed_story(new_story)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"setting set {SANDBOX_SETTING} off --project", actor=story.user)
    story.expect_success(f"worker sandbox {agent_number(story, worker.id)} on", actor=story.agent)
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": false', actor=story.agent)


def test_the_worker_itself_and_a_helper_cannot_switch_the_sandbox(new_story):
    story = sandboxed_story(new_story)
    repository_environment(story)
    worker = dispatched_worker(story)
    helper = Actor(story.new_row_id(f"agent start helper-1 claude helper --parent {worker.id} --environment main"), ActorType.AGENT)
    story.expect_refusal(f"worker sandbox {agent_number(story, worker.id)} off", "cannot switch a worker's sandbox", actor=worker)
    story.expect_refusal(f"worker sandbox {agent_number(story, worker.id)} off", "cannot switch a worker's sandbox", actor=helper)
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": false', actor=story.agent)


def test_a_dispatch_with_no_sandbox_starts_the_worker_switched_off(new_story):
    story = sandboxed_story(new_story)
    repository_environment(story)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet --no-sandbox 1")
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": true', actor=story.agent)


def test_a_send_with_no_sandbox_switches_a_kept_worker_off(new_story):
    story = sandboxed_story(new_story)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f'worker send {agent_number(story, worker.id)} "Check the totals too" --wait --no-sandbox', actor=story.agent)
    story.expect_text(f"usage agents --agent {agent_number(story, worker.id)} --json", '"sandbox_off": true', actor=story.agent)
