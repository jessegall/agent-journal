import os
import signal

from core.base.actor import Actor
from core.base.actor_type import ActorType
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
