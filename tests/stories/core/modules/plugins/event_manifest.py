import json
from pathlib import Path

import pytest

from engine.command.bus import Bus
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.base.model.event_form import EventForm
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_subscription import PluginSubscription
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
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


def test_s4_a_preview_shows_each_key_and_form_with_its_script_in_plain_words(event_page):
    rows = event_page.preview(event_folder(event_page.story, {"event": TASK_CREATED, **ALL_FORMS}))
    for form, script in ALL_FORMS.items():
        expect_listed(rows, category=form, label=TASK_CREATED, command=script)
    preview = PREVIEW.read_text()
    event_page.story.expect_rows("This is everything it runs" in preview, "Before a change" in preview, "During a change" in preview, "After a change" in preview)


def test_s4_a_plugin_with_no_listen_field_shows_as_it_did(event_page):
    rows = event_page.preview(sample_plugin_folder(event_page.story.home.folder.parent))
    event_page.story.expect_rows([row["category"] for row in rows] == ["program"], rows[0]["command"] == "run.sh")


def test_s5_a_wrong_key_is_marked_installs_and_runs_nothing_while_the_rest_of_the_plugin_works(event_page):
    story = event_page.story
    folder = event_folder(story, {"event": WRONG_KEY, "guard": "see.sh", "listen": "see.sh", "commit": "see.sh"}, {"event": PIN_CREATED, "commit": "right.sh"})
    expect_listed(event_page.preview(folder), category="guard", label=WRONG_KEY, state="wrong key")
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    event_page.expect_target()
    expect_listed(event_page.card(), key=WRONG_KEY, form="commit", state="wrong key")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_success('task edit 2 --title "Second job again"', actor=story.agent)
    story.expect_success("task delete 2", actor=story.agent)
    story.expect_success(PIN_LINE, actor=story.agent)
    story.run_listeners()
    expect_script_uncalled(story, "see.sh")
    story.expect_rows(len(script_calls(story, "right.sh")) == 1)
    story.expect_rows("No such event" in PREVIEW.read_text())


def test_s5_a_plugin_whose_only_key_is_wrong_still_installs(event_page):
    folder = event_folder(event_page.story, {"event": WRONG_KEY, "commit": "see.sh"})
    event_page.install(folder)
    event_page.expect_target()
    expect_listed(event_page.card(), key=WRONG_KEY, state="wrong key")


def test_s8_a_guard_on_a_system_event_installs_shows_the_only_form_and_its_commit_entry_works(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": BOOTING, "guard": "refuse.sh", "commit": "see.sh"})
    event_page.expect_target()
    expect_listed(event_page.card(), key=BOOTING, form="guard", state="form not offered")
    expect_listed(event_page.card(), key=BOOTING, form="commit", state="listens")
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, not script_calls(story, "refuse.sh"))


def test_s12_a_new_script_file_changes_the_digest_and_an_upgrade_takes_the_new_digest(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "see.sh"})
    original_digest = plugin_row(story).files_digest
    event_folder(story, {"event": TASK_CREATED, "commit": "see.sh"}, {"event": PIN_CREATED, "commit": "extra.sh"}, scripts={"extra.sh": ""}, version="1.1.0")
    event_page.preview_upgrade()
    event_page.upgrade()
    story.expect_rows(plugin_row(story).files_digest != original_digest)
    story.expect_success(PIN_LINE, actor=story.agent)
    story.run_listeners()
    event_page.expect_target()
    story.expect_rows(len(script_calls(story, "extra.sh")) == 1)


@pytest.mark.parametrize("form", ["guard", "commit"])
def test_s13_a_script_changed_on_disk_switches_the_plugin_off_and_the_chat_says_so(new_story, form):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, form: "see.sh"})
    script = story.home.folder / "plugins" / "events" / "see.sh"
    script.write_text(f'#!/bin/sh\ntouch "{plugin_data(story, "changed-script-ran")}"\n')
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_text("message list --environment main", "The plugin events is switched off", actor=story.user)
    story.expect_rows(plugin_row(story).enabled is False, not plugin_data(story, "changed-script-ran").exists())


def test_s13_a_script_changed_on_disk_switches_the_plugin_off_at_the_next_hook(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "see.sh"})
    script = story.home.folder / "plugins" / "events" / "see.sh"
    script.write_text(script.read_text() + "\n")
    story.hook("s-1", HookSamples.prompt("go on"))
    story.expect_text("message list --environment main", "The plugin events is switched off", actor=story.user)
    story.expect_rows(plugin_row(story).enabled is False)


def test_a_delivery_for_a_manifest_edited_into_broken_json_is_a_fault_and_is_not_tried_again(new_story):
    story = event_plugin_story(new_story, name="broken", program="see.sh", hears=["file_edited"])
    story.container.get(Bus).run(DeliverPluginEvent(plugin_row(story, "broken").id, story.agent.id, "file_edited", "{}"), story.user, environment_id=1)
    (story.home.folder / "plugins" / "broken" / "journal-plugin.json").write_text("{ half written")
    story.run_listeners()
    story.run_listeners()
    story.expect_rows(not script_calls(story, "see.sh", "broken"))
    plugin_page(story).expect_fault("not valid JSON", name="broken")


def test_the_subscriptions_hold_each_form_of_a_real_key_and_leave_out_what_is_wrong(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh", "commit": "../other/run.sh"}, {"event": TASK_CREATED, "guard": "see.sh", "listen": "pin.sh"}, {"event": WRONG_KEY, "commit": "see.sh"}, 42)
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "see.sh"}, {"event": BOOTING, "guard": "refuse.sh"}, name="second")
    subscriptions = story.container.get(PluginSubscriptions)
    story.expect_rows(subscriptions.scripts("task.create", EventForm.GUARD) == (PluginSubscription("events", "refuse.sh"), PluginSubscription("second", "see.sh")))
    story.expect_rows(subscriptions.scripts("task.create", EventForm.LISTEN) == tuple([PluginSubscription("events", "pin.sh")]))
    story.expect_rows(subscriptions.scripts("task.create", EventForm.COMMIT) == (), subscriptions.scripts("journal.booting", EventForm.GUARD) == ())
    story.expect_rows("pin.sh" in plugin_manifest(story).files, "refuse.sh" in plugin_manifest(story).files, "../other/run.sh" not in plugin_manifest(story).files)


def plugin_manifest(story) -> PluginManifest:
    return PluginManifest.read(story.home.folder / "plugins" / "events")
