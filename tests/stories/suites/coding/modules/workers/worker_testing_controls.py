import pytest
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from core.base.driver.command_category import CommandCategory
from core.base.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from core.testing.shell_part import ShellPart
from core.base.query.queries import Queries
from core.testing.story import Story
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.important_lines import WORKER_RUN_LINE, proved_worker
from tests.stories.suites.coding.modules.workers.merge_followup_plan import merge_story
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, worker_on_plan as plan_worker, worker_outside_plan as solo_worker
from tests.stories.suites.coding.modules.workers.test_batches import BATCH, PHASE, configure
from tests.stories.suites.coding.modules.workers.test_queue import affected_test_story, ended, queued_story
from tests.stories.support.story_checks import expect_value


def test_s32_the_phase_setting_off_tests_each_plan_task_whatever_the_outside_batch_size(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch, build_test="pytest tests/phase.py")
    configure(worker, PHASE, "off")
    configure(worker, BATCH, "4")
    for _ in range(4):
        expect_reply_allowed(worker.run_test())
    worker.change_and_prove(TEST_LINE)
    worker.story.expect_text("worker next --wait --differences none", "tests of task 1", actor=worker.worker)
    worker.story.expect_rows(len(worker.started) == 1, worker.current_task() == 1)


def test_s33_a_batch_outside_a_plan_runs_its_proofs_together_when_its_size_is_reached(new_story, monkeypatch):
    worker = solo_worker(new_story, monkeypatch)
    UserJoined().steps(worker.story)
    configure(worker, BATCH, "2")
    worker.prove_and_move_on(TEST_LINE)
    worker.story.expect_rows(worker.current_task() == 2, len(worker.started) == 0)
    worker.prove(TEST_LINE)
    worker.story.expect_text("worker deliver --wait --differences none", "tests of batch", actor=worker.worker)
    worker.end_all_tests()
    worker.story.expect_rows(len(worker.started) == 2)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    worker.story.expect_text("task show 2", "state: completed", actor=worker.story.agent)


RUNS = "journal.suites.coding.workers.worker-phase-test-runs"
COMMAND_TYPES = "journal.suites.coding.worker-command-types"


def test_s34_a_zero_allowance_sends_the_first_grouped_test_command_to_the_main_agent_for_approval(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    configure(worker, RUNS, "0")
    expect_reply_refusal(worker.run_test(), "--ask-main")


def test_s34_a_settings_edit_between_commands_keeps_the_commands_already_used(new_story, monkeypatch):
    worker = plan_worker(new_story, monkeypatch)
    expect_reply_allowed(worker.run_test())
    configure(worker, RUNS, "1")
    expect_reply_refusal(worker.run_test(), "--ask-main")
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
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = Actor(merger_agent(story).id, ActorType.AGENT)
    story.expect_text("merger next", f"worker {worker.id}", actor=merger)
    repository.checkout(ENVIRONMENT_BRANCH)
    return MergedWork(story, worker, merger)


def test_empty_merger_checks_keep_mechanical_judging(merged_work):
    story, worker, merger = merged_work.story, merged_work.worker, merged_work.merger
    story.expect_no_text(f"merger merge {worker.id}", "run:", actor=merger)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s39_configured_merger_checks_are_listed_after_the_merge_with_the_commit(merged_work):
    story, worker, merger = merged_work.story, merged_work.worker, merged_work.merger
    story.expect_success("setting set journal.suites.coding.workers.merger-commands '[\"journal sins --branch={commit}\"]' --project", actor=story.user)
    story.expect_text(f"merger merge {worker.id}", "run: journal sins --branch=", actor=merger)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_manual_merge_keeps_mechanical_judging(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s42_the_own_test_failure_limit_is_a_setting_and_counts_failures_already_recorded(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    _, worker = proved_worker(story)
    bus = story.container.get(Bus)
    for _ in range(3):
        bus.run(RecordOwnTestFailure(worker.id, 1, WORKER_RUN_LINE), Actor.core(), environment_id=1)
    story.expect_success("setting set journal.suites.coding.workers.own-test-failures-to-flag 3 --environment main", actor=story.user)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_text(f"worker logs {worker.id}", "! its own runs failed 3 times: tests/stories/cart.py", actor=story.agent)


def commit_count(folder) -> int:
    return int(subprocess.run(["git", "-C", str(folder), "rev-list", "--count", "HEAD"], capture_output=True, text=True, check=True).stdout)


def test_after_merge_failure_keeps_task_open(new_story):
    story, worker, _ = merge_story(new_story, ["false"])
    story.expect_refusal(f"worker merge --wait {worker.id}", "failed with code 1", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)


@pytest.mark.real_git
def test_after_merge_resume_does_not_merge_twice(new_story):
    story, worker, repository = merge_story(new_story, ["test -f marker.txt"])
    story.expect_refusal(f"worker merge --wait {worker.id}", "failed with code 1", actor=story.agent)
    merged = commit_count(repository.folder)
    Path(repository.folder, "marker.txt").write_text("")
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    expect_value(commit_count(repository.folder), merged)


def test_after_merge_empty_list_preserves_completion(new_story):
    story, worker, _ = merge_story(new_story, [])
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_s56_existing_merge_commands_survive_upgrade(new_story):
    story, worker, repository = merge_story(new_story, ["echo kept >> kept.txt"])
    story.expect_text("setting show journal.suites.coding.workers.merge-commands", "echo kept >> kept.txt", actor=story.user)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    expect_value(Path(repository.folder, "kept.txt").read_text().splitlines(), ["kept"])
