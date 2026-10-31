import json
import os
import signal
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.plugins.commands.support.plugin_health_check import PluginHealthCheck
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses
from tests.stories.core.modules.plugins.hooks import REMOVAL_SAMPLE
from tests.stories.core.modules.plugins.support.service_samples import service_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted


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
    child_pid = int((story.home.folder / "plugin-data" / "served" / "child.pid").read_text())
    story.processes.close()
    story.expect_rows(not is_running(child_pid))


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
