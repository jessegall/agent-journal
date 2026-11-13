from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.run_queue import queued
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner, moved_run, start_process
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.models.enums.process_setting import ProcessSetting


def timeout_tick(story):
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "run timeouts"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def saved_timeout(duration):
    part = ShellPart("make", CommandCategory.BUILD, ["package"]).prepared("make package")
    part.update(saved_command="cart-build", read_flag="tail:20", timeout_duration=duration)
    return HookSamples.tool_use("Bash", ToolType.SHELL, [], None,
           shell={"line": "make package", "parts": [part], "aliases": ["cart-build"], "redirects": [], "is_journal_only": False, "parse_error": ""})


def test_a_timeout_counts_from_the_start_and_not_when_it_was_set(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    story.advance(timedelta(minutes=1))
    story.expect_success(f"output timeout {process.id} 2m", actor=story.agent)
    story.advance(timedelta(seconds=59))
    timeout_tick(story)
    story.expect_success(f"process show {process.id}", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=1))
    timeout_tick(story)
    story.expect_success(f"process show {process.id}", "state: stopped", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "timed out", actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --json", "It ran past its timeout of 120 seconds")


def test_a_passed_limit_is_refused_and_the_run_keeps_going(new_story):
    story = new_story(fixture=UserBuilder)
    process = start_process(story, "make build", category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=45))
    story.expect_refusal(f"output timeout {process.id} 30s", "already passed", actor=story.agent)
    story.expect_success(f"process show {process.id}", "state: running", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).timeout_seconds is None)


def test_a_refused_replacement_preserves_the_existing_timeout(new_story):
    story = new_story(fixture=UserBuilder)
    process = start_process(story, "make package", category=CommandCategory.BUILD)
    story.expect_success(f"output timeout {process.id} 3m", actor=story.agent)
    story.advance(timedelta(minutes=1))
    story.expect_refusal(f"output timeout {process.id} 20s", "already passed", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).timeout_seconds == 180)


def test_an_ended_output_cannot_get_a_timeout(new_story):
    story = new_story(fixture=UserBuilder)
    process = ended_run(story, "make package", "built\n")
    story.expect_refusal(f"output timeout {process.id} 10m", "not running", actor=story.agent)


def test_a_saved_command_can_set_its_timeout_at_start(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success('alias add cart-build "make package" --category build', actor=story.agent)
    story.expect_hook_allowed("s-1", saved_timeout("5m"))
    process = story.container.get(Queries).query(Process).newest().page(1, 1).rows[0]
    story.expect_rows(process.timeout_seconds == 300)


def test_an_invalid_saved_command_timeout_refuses_the_run(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success('alias add cart-build "make package" --category build', actor=story.agent)
    story.expect_hook_refusal("s-1", saved_timeout("0s"), "Invalid --timeout")
    story.expect_rows(not story.container.get(Queries).query(Process).exists())


def test_a_run_ending_before_its_timeout_is_not_reported_as_timed_out(new_story):
    story = new_story(fixture=UserBuilder)
    process = start_process(story, "make package", category=CommandCategory.BUILD)
    story.expect_success(f"output timeout {process.id} 1m", actor=story.agent)
    end_run(story, process, "built\n")
    story.advance(timedelta(minutes=2))
    timeout_tick(story)
    story.expect_rows(story.container.get(Queries).query(Process).find(process.id).expired_at is None)


def test_time_waiting_in_the_queue_does_not_consume_the_timeout(new_story):
    story = new_story(fixture=QueueAgents)
    story.expect_success(f"setting set {ProcessSetting.RUN_BATCH_SIZE.key} 1 --environment main", actor=story.user)
    active = queued(story, "make active")
    waiting = queued(story, "make waiting")
    story.expect_success(f"output timeout {waiting.id} 10s", actor=story.user)
    story.advance(timedelta(minutes=2))
    timeout_tick(story)
    story.expect_rows(story.container.get(Queries).query(Process).find(waiting.id).started_at is None)
    end_run(story, active, "done\n")
    story.advance(timedelta(seconds=10))
    timeout_tick(story)
    story.expect_rows(story.container.get(Queries).query(Process).find(waiting.id).state is ProcessState.STOPPED)
