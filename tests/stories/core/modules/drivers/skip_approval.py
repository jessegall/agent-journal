import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.drivers.support.driver_settings import SKIPS_NEED_APPROVAL
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.drivers.support.confirmed_skips import TRIED
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from suites.coding.upgrade.coding_settings_move import LISTED_KEY

RULE = "workers.allowed-command-types"
REASON = "it is wrong here"
WORKER_SESSION = "worker-session"
REFUSED_LINE = "a worker here runs no edit command"
REMOVAL = HookSamples.shell("rm src/cart.py", ShellPart("rm", "edit", ["src/cart.py"], effects=["writes_files"]))


@pytest.fixture
def refused_worker(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    worker = Actor(story.new_row_id(f"agent start {WORKER_SESSION} claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success(lines.TASK_START, actor=worker)
    story.expect_success(f"""setting make {LISTED_KEY} '["read", "search"]' --environment main""")
    story.expect_hook_refusal(WORKER_SESSION, REMOVAL, REFUSED_LINE)
    skip = story.new_row_id(f'refusal skip {RULE} --reason "{REASON}" --environment main', actor=worker)
    return story, worker, skip


def confirmed(story, worker, skip):
    story.expect_success(f'refusal confirm {skip} --tried "{TRIED}" --environment main', actor=worker)


def test_a_workers_confirmed_skip_waits_and_its_main_agent_is_told(refused_worker):
    story, worker, skip = refused_worker
    story.expect_text(f'refusal confirm {skip} --tried "{TRIED}" --environment main', "waits for your main agent", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"refusal-skip:{skip}")
    story.expect_hook_refusal(WORKER_SESSION, REMOVAL, REFUSED_LINE)


def test_a_skip_its_main_agent_approves_passes_the_refusal_once(refused_worker):
    story, worker, skip = refused_worker
    confirmed(story, worker, skip)
    story.expect_success(f"refusal approve {skip} --environment main", actor=story.agent)
    story.expect_hook_allowed(WORKER_SESSION, REMOVAL)
    story.expect_hook_refusal(WORKER_SESSION, REMOVAL, REFUSED_LINE)


def test_a_skip_its_main_agent_declines_leaves_the_refusal_in_force(refused_worker):
    story, worker, skip = refused_worker
    confirmed(story, worker, skip)
    story.expect_success(f"refusal decline {skip} --environment main", actor=story.agent)
    story.expect_hook_refusal(WORKER_SESSION, REMOVAL, REFUSED_LINE)
    story.expect_refusal(f"refusal approve {skip} --environment main", "waits for no approval", actor=story.agent)


def test_a_worker_cannot_approve_its_own_skip(refused_worker):
    story, worker, skip = refused_worker
    confirmed(story, worker, skip)
    story.expect_refusal(f"refusal approve {skip} --environment main", "to answer", actor=worker)


def test_with_the_setting_off_a_workers_confirmed_skip_passes_at_once(refused_worker):
    story, worker, skip = refused_worker
    story.expect_success(f"setting set {SKIPS_NEED_APPROVAL} false --project", actor=story.user)
    confirmed(story, worker, skip)
    story.expect_hook_allowed(WORKER_SESSION, REMOVAL)
