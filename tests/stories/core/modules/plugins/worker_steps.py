import pytest

import json

from core.modules.plugins.support.plugin_folders import PluginFolders
from core.testing.hook_samples import HookSamples
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.plugins.support.worker_step_samples import step_plugin_folder
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, DISPATCH, FIRST_PROOF, checked_worker, dispatched_worker, repository_environment
def step_plugin_story(new_story, event_name: str, services: list[dict[str, object]] | None = None):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {step_plugin_folder(story.home.folder.parent, event_name, services)} --yes", actor=story.user)
    story.repository = repository_environment(story)
    return story


@pytest.fixture
def delivering_plugin(new_story):
    return step_plugin_story(new_story, "worker_delivering")



@pytest.fixture
def plugin_worker(delivering_plugin):
    return delivering_plugin, dispatched_worker(delivering_plugin)


def test_a_plugin_holding_a_workers_delivery_refuses_it_with_its_reason(plugin_worker):
    story, worker = plugin_worker
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_refusal(DELIVERY, "[plugin steps] cart.py has a sin", actor=worker)
    story.expect_text("worker-worktree list", "cut", actor=story.agent)


def delivered_with_file(new_story, name: str):
    story = step_plugin_story(new_story, "worker_delivering")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, name, "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    return story, worker


def test_a_plugin_that_fails_at_a_delivery_is_on_record_and_says_the_step_was_not_judged(new_story):
    story, worker = delivered_with_file(new_story, "broken.py")
    story.expect_text("plugin list --json", "at worker_delivering", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin steps] could not judge this step", actor=story.agent)


def test_a_hook_during_an_upgrade_leaves_the_plugin_switched_on(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    folders = story.container.get(PluginFolders)
    folders.upgrade_mark("steps").touch()
    manifest = folders.code("steps") / "journal-plugin.json"
    manifest.write_text(manifest.read_text() + "\n")
    story.hook("s-1", HookSamples.prompt("go on"))
    story.expect_text("plugin list", "steps", " on ")


def test_a_plugin_whose_files_changed_is_switched_off_and_the_chat_says_so(delivering_plugin):
    story = delivering_plugin
    manifest = story.container.get(PluginFolders).code("steps") / "journal-plugin.json"
    manifest.write_text(manifest.read_text() + "\n")
    story.hook("s-1", HookSamples.prompt("go on"))
    story.expect_text("message list --environment main", "The plugin steps is switched off", actor=story.user)



def test_a_failed_upgrade_leaves_no_upgrade_mark_and_the_next_delivery_reaches_the_plugin(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    source = step_plugin_folder(story.home.folder.parent, "worker_delivering") / "journal-plugin.json"
    source.write_text(json.dumps({**json.loads(source.read_text()), "version": "1.1.0", "setup": [{"name": "Build the cache", "run": "exit 4"}]}))
    story.expect_refusal("plugin upgrade steps --yes", "the setup step Build the cache failed", actor=story.user)
    story.expect_rows(not story.container.get(PluginFolders).upgrade_mark("steps").exists())
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_refusal(DELIVERY, "[plugin steps] cart.py has a sin", actor=worker)


def test_a_plugin_whose_files_changed_judges_no_worker_step(delivering_plugin):
    story = delivering_plugin
    manifest = story.container.get(PluginFolders).code("steps") / "journal-plugin.json"
    manifest.write_text(manifest.read_text() + "\n")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)


def test_a_plugin_being_upgraded_raises_nothing_in_the_step_check(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    folders = story.container.get(PluginFolders)
    folders.upgrade_mark("steps").touch()
    (folders.code("steps") / "journal-plugin.json").unlink()
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)
