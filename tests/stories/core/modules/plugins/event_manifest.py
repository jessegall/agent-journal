import json
from pathlib import Path

import pytest

from server.booting_work import BootingWork
from tests.stories.core.modules.plugins.support.event_modules import FORMER_NOTE_CREATED, NOTE_CREATED, NOTES, NOTES_GONE
from tests.stories.core.modules.plugins.support.event_stories import (
    PIN_CREATED, PIN_LINE, SECOND_JOB, TASK_CREATED, event_folder, event_page, event_plugin_story, expect_listed, install_event_plugin, plugin_data, plugin_page, plugin_row, script_calls)
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder

PREVIEW = Path("src/core/modules/plugins/web/src/PluginInstallPreview.vue")
CARD = Path("src/core/modules/plugins/web/src/PluginCard.vue")
WRONG_KEY = "core.tasks.task.closed"
BOOTING = "core.journal.booting"
ALL_FORMS = {"guard": "refuse.sh", "listen": "pin.sh", "commit": "see.sh"}
WRONG_ENTRIES = [[{"guard": "see.sh"}], [42], [{"event": 42, "guard": "see.sh"}]]


def expect_no_script_ran(story, *scripts: str) -> None:
    ran = {script: script_calls(story, script) for script in scripts if script_calls(story, script)}
    assert not ran, f"these scripts ran: {ran}"


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
    expect_no_script_ran(story, "see.sh")
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
    replace_module(story, NOTES, NOTES_GONE)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    page = plugin_page(story)
    page.expect_on()
    expect_listed(page.card(), key=NOTE_CREATED, form="commit", state="wrong key")
    expect_listed(page.card(), key=TASK_CREATED, form="commit", state="listens")
    story.expect_rows(not script_calls(story, "see.sh"), len(script_calls(story, "right.sh")) == 1)


def test_s11_a_renamed_key_keeps_being_heard_and_the_card_shows_what_it_is_called_now(new_story):
    story = event_plugin_story(new_story, {"event": FORMER_NOTE_CREATED, "commit": "see.sh"}, modules=[NOTES])
    story.expect_success('event-note make "A note"', actor=story.user)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1)
    story.expect_rows(calls[0]["event"] == NOTE_CREATED)
    page = plugin_page(story)
    expect_listed(page.card(), key=FORMER_NOTE_CREATED, form="commit", state="renamed", current_key=NOTE_CREATED)


def test_s12_an_upgrade_that_changes_what_it_listens_to_shows_new_and_no_longer_lines(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    event_folder(story, {"event": TASK_CREATED, "commit": "see.sh"}, version="1.1.0")
    offer = event_page.upgrade_offer()
    story.expect_rows(f"new commit {TASK_CREATED}: see.sh" in offer, f"no longer guard {TASK_CREATED}: refuse.sh" in offer)


def test_s12_a_new_script_file_changes_the_digest_and_an_upgrade_takes_the_new_digest(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "commit": "see.sh"})
    before = plugin_row(story).files_digest
    event_folder(story, {"event": TASK_CREATED, "commit": "see.sh"}, {"event": PIN_CREATED, "commit": "extra.sh"}, scripts={"extra.sh": ""}, version="1.1.0")
    event_page.upgrade_offer()
    event_page.upgrade()
    story.expect_rows(plugin_row(story).files_digest != before)
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
