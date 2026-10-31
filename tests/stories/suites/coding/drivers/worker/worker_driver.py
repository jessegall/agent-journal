from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask

WORKER_SESSION = "s-2"
CART_SEARCH = HookSamples.shell("grep -n total src/cart.py", ShellPart("grep", "search", ["-n", "total", "src/cart.py"]))
TASK_READ = HookSamples.shell("journal task show 1", ShellPart("journal", "journal", ["task", "show", "1"]))
GIT_STATUS = HookSamples.shell("git status", ShellPart("git", "version control", ["status"], subcommand="status"))
CART_REMOVAL = HookSamples.shell("rm src/cart.py", ShellPart("rm", "edit", ["src/cart.py"], effects=["writes_files"]))


def started_worker(story: Story) -> Actor:
    return Actor(story.new_row_id(f"agent start {WORKER_SESSION} claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)


def worker_with_started_task(story: Story) -> Actor:
    worker = started_worker(story)
    story.expect_success(lines.TASK_START, "state: started", f"holder_id: {worker.id}", actor=worker)
    return worker


def test_a_worker_whose_task_has_not_started_runs_journal_commands_only(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    started_worker(story)
    story.expect_hook_refusal(WORKER_SESSION, CART_SEARCH, "your task has not started yet: only journal commands run until it does")
    story.expect_hook_allowed(WORKER_SESSION, TASK_READ)


def test_a_worker_runs_no_git(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    worker_with_started_task(story)
    story.expect_hook_refusal(WORKER_SESSION, GIT_STATUS, "a worker runs no git: the journal commits and merges your work")


def test_a_worker_runs_no_command_of_a_type_its_setting_leaves_out(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    worker_with_started_task(story)
    story.expect_success("""setting make workers.command-types '["read", "search"]' --environment main""", "key: workers.command-types")
    story.expect_hook_allowed(WORKER_SESSION, CART_SEARCH)
    story.expect_hook_refusal(WORKER_SESSION, CART_REMOVAL, "a worker here runs no edit command: rm src/cart.py")


def test_a_worker_that_stops_with_its_task_started_is_told_to_deliver_it(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    worker_with_started_task(story)
    story.expect_hook_refusal(WORKER_SESSION, HookSamples.stop(), "task 1, Fix the cart, is still started: finish it and deliver it with journal worker deliver")
