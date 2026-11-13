import json
import shutil

from tests.stories.core.modules.plugins.support.plugin_samples import MANIFEST, sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined

READER = "cart-test"


def plugin_with_aliased_reader(new_story):
    story = new_story(fixture=UserJoined)
    folder = sample_plugin_folder(story.home.folder.parent)
    readers = folder / ".journal-plugin" / "readers"
    readers.mkdir(parents=True)
    (readers / f"{READER}.pattern").write_text("title: Cart tests\n^(ok|FAIL)\\s\nfinished: ^ok\n")
    (folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "aliases": [{"name": "cart-judge", "line": "run.sh", "reader": READER}]}))
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.expect_text("alias list", "cart-judge", actor=story.user)
    story.plugin_folder = folder
    return story


def test_removing_a_plugin_removes_its_alias_on_its_own_reader_and_the_reader(new_story):
    story = plugin_with_aliased_reader(new_story)
    story.expect_text("plugin remove sample", "removed sample", actor=story.user)
    story.expect_absent("alias list", "cart-judge", actor=story.user)
    story.expect_absent("reader list", READER, actor=story.user)


def test_removing_a_plugin_is_refused_while_an_alias_of_a_person_uses_its_reader(new_story):
    story = plugin_with_aliased_reader(new_story)
    story.expect_success(f'alias add mine "echo" --reader {READER}', actor=story.user)
    story.expect_refusal("plugin remove sample", "reader is referenced by alias", actor=story.user)
    story.expect_text("reader list", READER, actor=story.user)


def test_an_upgrade_that_changes_a_shipped_reader_changes_the_reader_in_the_project(new_story):
    story = plugin_with_aliased_reader(new_story)
    story.expect_text("reader list", READER, "Cart tests", actor=story.user)
    local_build = story.home.folder.parent / "local-build"
    shutil.copytree(story.plugin_folder, local_build)
    (local_build / ".journal-plugin" / "readers" / f"{READER}.pattern").write_text("title: Judging the cart\n^(ok|FAIL)\\s\nfinished: ^done\n")
    (local_build / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "version": "2.0.0", "aliases": [{"name": "cart-judge", "line": "run.sh", "reader": READER}]}))
    story.expect_success(f"plugin upgrade sample --from {local_build} --yes", actor=story.user)
    story.expect_text("reader list", READER, "Judging the cart", "^done", actor=story.user)
    story.expect_absent("reader list", "Cart tests", actor=story.user)
