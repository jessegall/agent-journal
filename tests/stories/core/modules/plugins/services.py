import json
from pathlib import Path
import os
import select
import signal
from datetime import timedelta

from core.base.actor import Actor
from core.base.file_access import FileAccess
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.support.plugin_program import SETTINGS_FILE
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.plugins.commands.support.plugin_health_check import PluginHealthCheck
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.event_stories import plugin_row
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.hooks import REMOVAL_SAMPLE, start_counter
from tests.stories.core.modules.plugins.support.service_samples import service_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

END_LIMIT_SECONDS = 5
REMOVAL_PART = ShellPart("rm", CommandCategory.EDIT, ["-rf", "build"], effects=[CommandEffect.DELETES_FILES])


def served_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {service_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    story.run("setting set journal.core.plugins.hold_window_ms 5000 --project", actor=story.user)
    story.services, story.processes = story.container.get(PluginServices), ServiceProcesses()
    story.services.follow(story.processes)
    return story


def test_a_service_that_answers_is_asked_in_place_of_the_program(new_story):
    story = served_story(new_story)
    try:
        story.expect_hook_refusal("s-1", REMOVAL_SAMPLE, "[plugin served] the service says no")
    finally:
        story.processes.close()


def test_a_line_of_four_parts_reaches_the_service_as_four_events_and_starts_no_program(new_story, monkeypatch):
    story = served_story(new_story)
    try:
        starts = start_counter(monkeypatch, "run.sh")
        story.expect_hook_refusal("s-1", four_parts(REMOVAL_PART), "[plugin served] the service says no")
        served_lines = (story.home.folder / "plugin-data" / "served" / "asked").read_text().splitlines()
        story.expect_rows(len(served_lines) == 4, starts == [])
    finally:
        story.processes.close()


def test_a_line_of_four_parts_reads_the_agent_and_its_skills_as_a_line_of_one_part_does_and_writes_the_settings_once(new_story, monkeypatch):
    story = served_story(new_story)
    try:
        calls = counted_calls(monkeypatch)
        story.expect_hook_refusal("s-1", HookSamples.shell("rm -rf build", REMOVAL_PART), "[plugin served] the service says no")
        one_part = dict(calls)
        calls.update(settings=0, agent=0, skills=0)
        story.expect_hook_refusal("s-1", four_parts(REMOVAL_PART), "[plugin served] the service says no")
        asked = [json.loads(line) for line in (story.home.folder / "plugin-data" / "served" / "asked").read_text().splitlines()]
        story.expect_rows([line["data"]["position"] for line in asked[-4:]] == [0, 1, 2, 3], one_part["skills"] == 1, calls["agent"] == one_part["agent"], calls["skills"] == 1, one_part["settings"] + calls["settings"] <= 1)
    finally:
        story.processes.close()


def counted_calls(monkeypatch) -> dict[str, int]:
    calls = {"settings": 0, "agent": 0, "skills": 0}
    write, find, names = FileAccess.write, AgentRows.find, LoadedSkills.names

    def counted_write(self, file, *arguments, **options):
        calls["settings"] += 1 if Path(file).name == SETTINGS_FILE else 0
        return write(self, file, *arguments, **options)

    def counted_find(self, agent_id):
        calls["agent"] += 1
        return find(self, agent_id)

    def counted_names(self, agent_id):
        calls["skills"] += 1
        return names(self, agent_id)

    monkeypatch.setattr(FileAccess, "write", counted_write)
    monkeypatch.setattr(AgentRows, "find", counted_find)
    monkeypatch.setattr(LoadedSkills, "names", counted_names)
    return calls


def test_a_line_of_four_parts_starts_no_program_while_the_service_is_closed(new_story, monkeypatch):
    story = served_story(new_story)
    story.processes.close()
    starts = start_counter(monkeypatch, "run.sh")
    story.expect_hook_allowed("s-1", four_parts(ShellPart("whoami", CommandCategory.READ, [])))
    story.expect_hook_allowed("s-1", four_parts(ShellPart("whoami", CommandCategory.READ, [])))
    served = plugin_row(story, "served")
    story.expect_rows(starts == [], served.fault_count == 0, not served.failing)
    story.expect_text("plugin list", "last fault: its service answers is closed, so the event went through unjudged at command_starting", actor=story.user)


def test_a_delivery_runs_the_program_while_the_service_is_closed_and_records_no_fault(new_story, monkeypatch):
    story = served_story(new_story)
    story.processes.close()
    starts = start_counter(monkeypatch, "run.sh")
    scanned_edit(story, "s-1", "a.py")
    story.run_listeners()
    served = plugin_row(story, "served")
    story.expect_rows(starts == ["served"], served.fault_count == 0, served.last_fault == "")


def four_parts(last: ShellPart):
    return HookSamples.shell(f"ls && pwd && date && {last.program} {' '.join(last.arguments)}", *(ShellPart(name, CommandCategory.READ, []) for name in ("ls", "pwd", "date")), last)


def test_the_services_read_names_each_service_and_whether_it_runs(new_story):
    story = served_story(new_story)
    try:
        story.expect_text("plugin services", "served answers: running")
    finally:
        story.processes.close()
    story.expect_text("plugin services", "served answers: stopped")


def test_a_service_that_ended_is_started_again_by_the_next_follow(new_story):
    story = served_story(new_story)
    try:
        first = story.processes.running[("served", "answers")]
        os.kill(first.pid, signal.SIGKILL)
        first.wait(5)
        story.services.follow(story.processes)
        story.expect_rows(story.processes.running[("served", "answers")].running(), story.processes.running[("served", "answers")].pid != first.pid)
    finally:
        story.processes.close()


def test_a_service_is_started_again_once_the_files_of_its_plugin_changed(new_story):
    story = served_story(new_story)
    try:
        first = story.processes.running[("served", "answers")]
        story.services.follow(story.processes)
        story.expect_rows(story.processes.running[("served", "answers")].pid == first.pid)
        code = story.container.get(PluginFolders).code("served")
        (code / "journal-plugin.json").write_text((code / "journal-plugin.json").read_text() + "\n")
        upgraded = PluginDigest.digest(code, PluginManifest.read(code))
        story.container.get(Database).update(Statement("UPDATE plugins SET files_digest = ?, version = version + 1 WHERE name = 'served'", [upgraded]))
        story.services.follow(story.processes)
        second = story.processes.running[("served", "answers")]
        story.expect_rows(second.pid != first.pid, second.running(), not first.running())
    finally:
        story.processes.close()


def test_a_switched_off_plugins_services_are_stopped(new_story):
    story = served_story(new_story)
    try:
        process = story.processes.running[("served", "answers")]
        story.run("plugin disable served", actor=story.user)
        story.services.follow(story.processes)
        process.wait(5)
        story.expect_rows(not process.running(), ("served", "answers") not in story.processes.running)
    finally:
        story.processes.close()


def test_a_service_that_answers_its_health_check_leaves_the_plugin_without_a_fault(new_story):
    story = served_story(new_story)
    try:
        story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_absent("plugin list", "last fault", actor=story.user)
    finally:
        story.processes.close()


def test_a_health_check_missed_is_the_plugins_fault_and_starts_the_service_again(new_story):
    story = served_story(new_story)
    try:
        first = story.processes.running[("served", "answers")]
        (story.home.folder / "plugin-data" / "served" / "unwell").write_text("")
        story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_text("plugin list", "last fault: its service answers missed its health check", actor=story.user)
        story.expect_rows(story.processes.running[("served", "answers")].pid != first.pid)
    finally:
        story.processes.close()


def test_five_health_checks_missed_in_a_row_show_the_plugin_failing(new_story):
    story = served_story(new_story)
    try:
        (story.home.folder / "plugin-data" / "served" / "unwell").write_text("")
        for _ in range(5):
            story.container.get(PluginHealthCheck).run(story.processes)
        story.run_listeners()
        story.expect_text("chat-mark list --environment 1", "Plugin served is failing: its service answers missed its health check", actor=story.user)
    finally:
        story.processes.close()


def is_running(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    return True


def test_stopping_a_service_ends_the_children_it_started(new_story):
    story = served_story(new_story)
    reader = os.open(story.home.folder / "plugin-data" / "served" / "child.alive", os.O_RDONLY | os.O_NONBLOCK)
    story.processes.close()
    readable, _, _ = select.select([reader], [], [], END_LIMIT_SECONDS)
    ended = bool(readable) and os.read(reader, 1) == b""
    os.close(reader)
    story.expect_rows(ended)


def test_a_server_started_after_a_crash_stops_the_service_left_running_before_starting_its_own(new_story):
    story = served_story(new_story)
    leftover = story.processes.running[("served", "answers")]
    after_crash = ServiceProcesses()
    try:
        story.services.follow(after_crash)
        leftover.exit_code()
        story.expect_rows(not is_running(leftover.pid), after_crash.running[("served", "answers")].pid != leftover.pid)
    finally:
        after_crash.close()
        story.processes.close()


def conditioned_story(new_story, condition: str):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = service_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    manifest["services"][0]["when"] = condition
    (folder / "journal-plugin.json").write_text(json.dumps(manifest))
    story.run(f"plugin install {folder} --yes", actor=story.user)
    story.run("setting set journal.core.plugins.condition_limit_seconds 1 --project", actor=story.user)
    story.services, story.processes = story.container.get(PluginServiceRound), ServiceProcesses()
    return story


def test_a_service_whose_condition_kept_it_from_starting_is_not_listed(new_story):
    story = conditioned_story(new_story, "false")
    try:
        story.services.run(story.processes)
        story.expect_absent("plugin services", "served answers")
    finally:
        story.processes.close()


def test_a_condition_past_its_limit_counts_as_failed_and_is_the_plugins_fault(new_story):
    story = conditioned_story(new_story, "sleep 5")
    try:
        story.services.run(story.processes)
        story.run_listeners()
        story.expect_rows(("served", "answers") not in story.processes.running)
        story.expect_text("plugin list", "last fault: the condition of its service answers ran past 1 s", actor=story.user)
    finally:
        story.processes.close()


def test_a_service_whose_condition_later_passes_starts_once_it_is_checked_again(new_story):
    story = conditioned_story(new_story, 'test -f "$JOURNAL_PLUGIN_DATA/ready"')
    try:
        story.services.run(story.processes)
        story.expect_rows(("served", "answers") not in story.processes.running)
        (story.home.folder / "plugin-data" / "served" / "ready").write_text("")
        story.advance(timedelta(minutes=11))
        story.services.run(story.processes)
        story.expect_rows(("served", "answers") in story.processes.running)
    finally:
        story.processes.close()
