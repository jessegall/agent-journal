import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.plugins.hooks import EDIT_SAMPLE, LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


def worker_story(new_story, reaches: dict[str, list[str]]):
    story = install_runner(new_story(fixture=OrchestratorWithOpenTask))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "reaches": reaches}))
    story.run(f"plugin install {folder} --yes", actor=story.user)
    repository_environment(story)
    story.worker_session = worker_session(story, dispatched_worker(story))
    return story


def test_a_plugin_that_reaches_workers_hears_a_workers_file_edit_and_its_line_reaches_that_worker(new_story):
    story = worker_story(new_story, {"file_edited": ["workers"]})
    story.hook(story.worker_session, EDIT_SAMPLE)
    story.run_listeners()
    story.expect_hook_allowed(story.worker_session, LISTING_SAMPLE, "[plugin sample] a.py was judged")


def test_a_plugin_that_names_no_workers_hears_no_worker(new_story):
    story = worker_story(new_story, {})
    story.hook(story.worker_session, EDIT_SAMPLE)
    story.run_listeners()
    story.expect_absent_hook_line(story.worker_session, LISTING_SAMPLE, "a.py was judged")
