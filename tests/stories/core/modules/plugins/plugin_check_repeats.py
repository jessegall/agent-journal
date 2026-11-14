from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, REMOVAL_SAMPLE, installed_story
from tests.stories.support.plugin_check_counts import PluginCheckCounts

HOOK_COUNT = 10


def test_hooks_do_not_repeat_the_plugin_checks_while_no_file_the_manifest_names_changed(new_story):
    story = installed_story(new_story)
    with PluginCheckCounts.counted() as counts:
        for _ in range(HOOK_COUNT):
            story.hook("s-1", LISTING_SAMPLE)
        (story.home.folder / "plugins" / "sample" / "notes.md").write_text("a file the manifest does not name")
        story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "plugin:")
    story.expect_text("plugin list", "sample", "on", actor=story.user)
    assert counts.count <= 1, counts.count
