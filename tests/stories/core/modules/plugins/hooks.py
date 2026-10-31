import json
import os

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

REMOVAL_SAMPLE = HookSamples.shell("rm -rf build", ShellPart("rm", CommandCategory.EDIT, ["-rf", "build"], effects=[CommandEffect.DELETES_FILES]))
LISTING_SAMPLE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
EDIT_SAMPLE = HookSamples.edit("a.py").with_fields(event="post_tool_use")


def installed_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {sample_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    return story


def test_a_command_the_plugin_holds_and_refuses_is_refused_with_its_reason(new_story):
    story = installed_story(new_story)
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "[plugin sample] no deletes here")


def test_a_command_the_plugin_allows_goes_through(new_story):
    story = installed_story(new_story)
    story.expect_hook_allowed("s-1", LISTING_SAMPLE)


def test_a_file_edit_reaches_the_plugin_after_the_reply_and_its_line_reaches_the_agent_at_the_next_hook(new_story):
    story = installed_story(new_story)
    story.expect_absent_hook_line("s-1", EDIT_SAMPLE, "a.py was judged")
    story.run_listeners()
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] a.py was judged")


def test_a_line_in_the_plugins_queue_reaches_the_agent_once(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "two sins in b.py"}))
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] two sins in b.py")
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "two sins in b.py")


def test_a_changed_plugin_file_switches_the_plugin_off_until_the_user_switches_it_on(new_story):
    story = installed_story(new_story)
    program = story.home.folder / "plugins" / "sample" / "run.sh"
    program.write_text(program.read_text() + "\n")
    story.expect_hook_allowed("s-1", REMOVAL_SAMPLE, "[plugin sample] switched off: its files changed since it was installed")
    story.expect_text("plugin list", "sample", "off", actor=story.user)
    story.run("plugin enable sample", actor=story.user)
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "[plugin sample] no deletes here")


def test_a_switched_off_plugin_hears_nothing(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    story.expect_hook_allowed("s-1", REMOVAL_SAMPLE)


def test_a_queue_file_that_is_not_json_is_set_aside_as_the_plugins_fault_and_the_next_line_still_arrives(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text("{not json")
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_text("plugin list", "last fault: its queue file 1.json is not JSON", actor=story.user)
    (queue / "2.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "two sins in c.py"}))
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] two sins in c.py")


def test_a_line_reserved_by_a_hook_that_never_committed_is_offered_again(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    reserved_file = queue / "1.json.rolled-back.reserved"
    reserved_file.write_text(json.dumps({"v": 1, "env": "main", "tell": "three sins in d.py"}))
    os.utime(reserved_file, (0, 0))
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] three sins in d.py")


def test_a_line_whose_hook_committed_is_never_offered_again_though_its_file_waits_to_be_deleted(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "five sins in f.py"}))
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] five sins in f.py")
    for reserved_file in queue.glob("*.reserved"):
        os.utime(reserved_file, (0, 0))
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "five sins in f.py")


def test_a_line_read_by_a_hook_is_not_read_again_before_it_is_deleted(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "tell": "four sins in e.py"}))
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] four sins in e.py")
    story.expect_absent_hook_line("s-1", LISTING_SAMPLE, "four sins in e.py")
    story.run_listeners()
    story.expect_rows(not any(queue.iterdir()))
