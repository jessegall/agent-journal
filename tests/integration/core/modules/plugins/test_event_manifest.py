import json
from pathlib import Path

import pytest

from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from engine.enums.event_form import EventForm
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from engine.testing.examples.hook_samples import HookSamples
from server.work.booting_work import BootingWork
from tests.stories.core.modules.plugins.hooks import REMOVAL_SAMPLE
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.plugins.support.event_modules import FORMER_NOTE_CREATED, NOTE_CREATED, NOTES, REMOVED_NOTES_MODULE
from tests.stories.core.modules.plugins.support.event_stories import (
    EVENT_SCRIPTS, PIN_CREATED, PIN_LINE, SECOND_JOB, TASK_CREATED, event_folder, event_page, event_plugin_story, expect_listed, install_event_plugin, plugin_data, plugin_page, plugin_row, script_calls)
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder

PREVIEW = Path("src/core/modules/plugins/web/src/PluginInstallPreview.vue")
WRONG_KEY = "core.tasks.task.closed"
BOOTING = "core.journal.booting"
ALL_FORMS = {"guard": "refuse.sh", "listen": "pin.sh", "commit": "see.sh"}
WRONG_ENTRIES = [[{"guard": "see.sh"}], [42], [{"event": 42, "guard": "see.sh"}]]


def expect_script_uncalled(story, *scripts: str) -> None:
    calls = {script: script_calls(story, script) for script in scripts if script_calls(story, script)}
    story.expect_rows(not calls)


def replace_module(story, old: str, new: str) -> None:
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([new if module == old else module for module in modules]))
    code, text = story.synced()
    assert code == 0, text










def test_s8_a_guard_on_a_system_event_installs_shows_the_only_form_and_its_commit_entry_works(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": BOOTING, "guard": "refuse.sh", "commit": "see.sh"})
    event_page.expect_target()
    expect_listed(event_page.card(), key=BOOTING, form="guard", state="form not offered")
    expect_listed(event_page.card(), key=BOOTING, form="commit", state="listens")
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, not script_calls(story, "refuse.sh"))










def test_the_subscriptions_hold_each_form_of_a_real_key_and_leave_out_what_is_wrong(played):
    story = event_plugin_story(played, {"event": TASK_CREATED, "guard": "refuse.sh", "commit": "../other/run.sh"}, {"event": TASK_CREATED, "guard": "see.sh", "listen": "pin.sh"}, {"event": WRONG_KEY, "commit": "see.sh"}, 42)
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "see.sh"}, {"event": BOOTING, "guard": "refuse.sh"}, name="second")
    subscriptions = story.container.get(PluginSubscriptions)
    story.expect_rows(subscriptions.scripts("task.create", EventForm.GUARD) == (PluginSubscription("events", "refuse.sh"), PluginSubscription("second", "see.sh")))
    story.expect_rows(subscriptions.scripts("task.create", EventForm.LISTEN) == tuple([PluginSubscription("events", "pin.sh")]))
    story.expect_rows(subscriptions.scripts("task.create", EventForm.COMMIT) == (), subscriptions.scripts("journal.booting", EventForm.GUARD) == ())
    story.expect_rows("pin.sh" in plugin_manifest(story).files, "refuse.sh" in plugin_manifest(story).files, "../other/run.sh" not in plugin_manifest(story).files)


def plugin_manifest(story) -> PluginManifest:
    return PluginManifest.read(story.home.folder / "plugins" / "events")
