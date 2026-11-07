import json
from pathlib import Path

import pytest

from core.base.command.bus import Bus
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
CARD = Path("src/core/modules/plugins/web/src/PluginCard.vue")
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
    event_page.expect_on()
    expect_listed(event_page.card(), key=WRONG_KEY, form="commit", state="wrong key")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_success('task edit 2 --title "Second job again"', actor=story.agent)
    story.expect_success("task delete 2", actor=story.agent)
    story.expect_success(PIN_LINE, actor=story.agent)
    story.run_listeners()
    expect_script_uncalled(story, "see.sh")
    story.expect_rows(len(script_calls(story, "right.sh")) == 1)
    story.expect_rows("No such event" in PREVIEW.read_text(), "Nothing reaches this script." in CARD.read_text())


def test_s5_a_plugin_whose_only_key_is_wrong_still_installs(event_page):
    folder = event_folder(event_page.story, {"event": WRONG_KEY, "commit": "see.sh"})
    event_page.install(folder)
    event_page.expect_on()
    expect_listed(event_page.card(), key=WRONG_KEY, state="wrong key")


@pytest.mark.parametrize("entries", WRONG_ENTRIES)
def test_s6_an_entry_of_the_wrong_shape_installs_and_shows_as_wrong(event_page, entries):
    story = event_page.story
    install_event_plugin(story, *entries, {"event": TASK_CREATED, "commit": "see.sh"})
    event_page.expect_on()
    card = event_page.card()
    expect_listed(card, key=TASK_CREATED, form="commit", state="listens")
    story.expect_rows(any(row["state"] == "wrong key" for row in card))


def test_s6_a_listen_that_is_a_text_and_not_a_list_installs_and_shows_as_wrong(event_page):
    install_event_plugin(event_page.story, listen=TASK_CREATED)
    event_page.expect_on()
    event_page.story.expect_rows(any(row["state"] == "wrong key" for row in event_page.card()))


def test_s7_a_script_outside_the_folder_installs_and_never_runs_and_the_card_says_so(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "../other/run.sh"})
    outside = story.home.folder / "plugins" / "other" / "run.sh"
    outside.parent.mkdir(parents=True)
    outside.write_text(f'#!/bin/sh\ntouch "{outside}.called"\n')
    outside.chmod(0o755)
    expect_listed(event_page.card(), key=TASK_CREATED, form="commit", script="../other/run.sh", state="wrong script")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(not Path(f"{outside}.called").exists())


def test_s8_a_guard_on_a_system_event_installs_shows_the_only_form_and_its_commit_entry_works(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": BOOTING, "guard": "refuse.sh", "commit": "see.sh"})
    event_page.expect_on()
    expect_listed(event_page.card(), key=BOOTING, form="guard", state="form not offered")
    expect_listed(event_page.card(), key=BOOTING, form="commit", state="listens")
    story.expect_rows("takes only After a change" in CARD.read_text())
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, not script_calls(story, "refuse.sh"))


def test_s9_an_old_name_in_hears_installs_and_the_card_shows_it_as_for_a_key(event_page):
    install_event_plugin(event_page.story, program="see.sh", hears=["tol_starting"])
    event_page.expect_on()
    expect_listed(event_page.card(), key="tol_starting", state="wrong key")


def test_s10_a_key_the_journal_stops_raising_stays_on_shows_on_the_card_and_other_keys_go_on(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "commit": "see.sh"}, {"event": TASK_CREATED, "commit": "right.sh"}, modules=[NOTES])
    replace_module(story, NOTES, REMOVED_NOTES_MODULE)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    page = plugin_page(story)
    page.expect_on()
    expect_listed(page.card(), key=NOTE_CREATED, form="commit", state="wrong key")
    expect_listed(page.card(), key=TASK_CREATED, form="commit", state="listens")
    story.expect_rows(not script_calls(story, "see.sh"), len(script_calls(story, "right.sh")) == 1)


def test_s11_a_renamed_key_keeps_being_heard_and_the_card_shows_what_it_is_called_now(new_story):
    story = event_plugin_story(new_story, {"event": FORMER_NOTE_CREATED, "commit": "see.sh"}, modules=[NOTES])
    expect_listed(plugin_page(story).card(), key=FORMER_NOTE_CREATED, form="commit", state="renamed", current_key=NOTE_CREATED)
    story.expect_success('event-note make "A note"', actor=story.user)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    story.expect_rows(calls[0]["event"] == NOTE_CREATED)


def test_s12_an_upgrade_that_changes_what_it_listens_to_shows_new_and_no_longer_lines(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    event_folder(story, {"event": TASK_CREATED, "commit": "see.sh"}, version="1.1.0")
    upgrade_text = event_page.preview_upgrade()
    story.expect_rows(f"new commit {TASK_CREATED}: see.sh" in upgrade_text, f"no longer guard {TASK_CREATED}: refuse.sh" in upgrade_text)


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
    event_page.expect_on()
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


def test_a_manifest_edited_into_broken_json_faults_that_plugin_and_others_still_answer_the_hook(new_story):
    story = install_runner(event_plugin_story(new_story, name="broken", program="see.sh", hears=["command_starting"]))
    install_event_plugin(story, scripts={"refuse.sh": EVENT_SCRIPTS["refuse.sh"]}, name="answers", program="refuse.sh", hears=["command_starting"], holds=[{"event": "command_starting", "window_ms": 5000}])
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    (story.home.folder / "plugins" / "broken" / "journal-plugin.json").write_text("{ half written")
    story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "plugin:2 refused")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin answers] not today", actor=story.agent)
    story.run_listeners()
    page = plugin_page(story)
    page.expect_fault("its manifest cannot be read", name="broken")
    story.expect_rows(plugin_row(story, "broken").enabled is True)


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
