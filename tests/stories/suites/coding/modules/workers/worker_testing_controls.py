from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.server.support.server_client import server_story
from tests.stories.core.support.agent_labels import agent_number
import pytest
import json
from dataclasses import dataclass
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from engine.enums.command_category import CommandCategory
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_refusal
from engine.testing.examples.shell_part import ShellPart
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.important_lines import WORKER_RUN_LINE, proved_worker
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker as plan_worker, unplanned_worker as solo_worker
from tests.stories.suites.coding.modules.workers.test_queue import affected_test_story, ended, queued_story
from tests.stories.core.support.agent_labels import agent_label
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_FAILURE_LIMIT
from suites.coding.upgrade.coding_settings_move import LISTED_KEY
RUNS = f"{WORKER_PHASE_TEST_RUNS}"
COMMAND_TYPES = f"{LISTED_KEY}"


def configure(worker, key, value):
    with server_story(worker.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        return server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", key, value, "--environment", "main"]})


def test_s34_a_zero_allowance_sends_the_first_grouped_test_command_to_the_main_agent_for_approval(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    configure(worker, RUNS, "0")
    expect_reply_refusal(worker.run_test(), "No test runs left")


def test_s34_a_settings_edit_between_commands_keeps_the_commands_already_used(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    expect_reply_allowed(worker.run_test())
    configure(worker, RUNS, "1")
    expect_reply_refusal(worker.run_test(), "No test runs left")
    configure(worker, RUNS, "3")
    expect_reply_allowed(worker.run_test())


def test_s36_adding_version_control_to_the_worker_command_types_does_not_allow_a_worker_git(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    configure(worker, COMMAND_TYPES, json.dumps(["read", "search", "edit", "test run", "build", "version control"]))
    expect_reply_refusal(worker.run_line("git status", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"])), "a worker runs no git")


def test_s37_the_picked_files_become_the_arguments_of_the_project_test_command(new_story, monkeypatch):
    story, _, _, started = affected_test_story(new_story, monkeypatch)
    story.container.get(OutputFolder).write_output(started[1], 1, "tests/cart.py\n")
    ended(story, started[1], 0)
    story.expect_rows(story.container.get(Queries).query(Process).find(started[2]).line == "python3 -m pytest -q tests/cart.py")
    ended(story, started[2], 0)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s38_a_failed_selected_test_returns_the_work_and_no_full_suite_follows(new_story, monkeypatch):
    story, _, _, started = affected_test_story(new_story, monkeypatch)
    story.container.get(OutputFolder).write_output(started[1], 1, "tests/cart.py\n")
    ended(story, started[1], 0)
    ended(story, started[2], 1)
    story.expect_rows(len(started) == 3)
    story.expect_text("task show 1", "state: started", actor=story.agent)


@dataclass(frozen=True)
class MergedWork:
    story: Story
    worker: Actor
    merger: Actor


@pytest.fixture
def merged_work(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = Actor(merger_agent(story).id, ActorType.AGENT)
    story.expect_text("merger next", agent_label(story, worker.id), actor=merger)
    repository.checkout(ENVIRONMENT_BRANCH)
    return MergedWork(story, worker, merger)


def test_empty_merger_checks_keep_mechanical_judging(merged_work):
    story, worker, merger = merged_work.story, merged_work.worker, merged_work.merger
    story.expect_no_text(f"merger merge {agent_number(story, worker.id)}", "run:", actor=merger)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s39_configured_merger_checks_are_listed_after_the_merge_with_the_commit(merged_work):
    story, worker, merger = merged_work.story, merged_work.worker, merged_work.merger
    story.expect_success("setting set journal.suites.coding.workers.merger-commands '[\"journal sins --branch={commit}\"]' --project", actor=story.user)
    story.expect_text(f"merger merge {agent_number(story, worker.id)}", "run: journal sins --branch=", actor=merger)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_manual_merge_keeps_mechanical_judging(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s42_the_own_test_failure_limit_is_a_setting_and_counts_failures_already_recorded(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    _, worker = proved_worker(story)
    bus = story.container.get(Bus)
    for _ in range(3):
        bus.run(RecordOwnTestFailure(worker.id, 1, WORKER_RUN_LINE), Actor.core(), environment_id=1)
    story.expect_success(f"setting set {WORKER_RUN_FAILURE_LIMIT} 3 --environment main", actor=story.user)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_text(f"worker logs {agent_number(story, worker.id)}", "! its own runs failed 3 times: tests/stories/cart.py", actor=story.agent)
