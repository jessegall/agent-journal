import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


def worker_story(new_story, reaches: dict[str, list[str]]):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "reaches": reaches}))
    story.run(f"plugin install {folder} --yes", actor=story.user)
    repository_environment(story)
    story.worker = dispatched_worker(story)
    story.worker_session = worker_session(story, story.worker)
    return story


def deliveries(story) -> int:
    return story.container.get(Queries).query(PluginDelivery).count()


def test_a_plugin_whose_files_changed_gets_no_file_edit(new_story):
    story = worker_story(new_story, {"file_edited": ["workers"]})
    scanned_edit(story, story.worker_session, "a.py")
    story.expect_rows(deliveries(story) == 1)
    manifest = story.container.get(PluginFolders).code("sample") / "journal-plugin.json"
    manifest.write_text(manifest.read_text() + "\n")
    scanned_edit(story, story.worker_session, "b.py")
    story.expect_rows(deliveries(story) == 1)
