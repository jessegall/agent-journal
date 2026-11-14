from tests.stories.core.modules.processes.support.process_samples import DEFAULT_QUEUE_WAIT_SECONDS
import shlex

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.modules.processes.support.process_samples import expect_rewritten, install_runner, runner_line
from engine.sandbox.shell_sandbox import ShellSandbox
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


def test_a_workers_shell_uses_its_registered_worktree(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    story.replace(ShellSandbox, ShellSandbox(story.home))
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.run("task overview 1", actor=worker)
    reply = story.hook(session, HookSamples.shell("cat cart.py", ShellPart("cat", CommandCategory.READ, ["cart.py"])))
    expected = runner_line(story, 1, "cat cart.py", limit=0, session=session, read_command=True, sandbox=True, checkout_folder=repository.worktree_folder(worker.id), queue_wait=DEFAULT_QUEUE_WAIT_SECONDS)
    expected = expected.replace(" --read-only-shell", f" --read-only-shell --write-folder {shlex.quote(str(repository.worktree_folder(worker.id)))}")
    expect_rewritten(reply, expected)
