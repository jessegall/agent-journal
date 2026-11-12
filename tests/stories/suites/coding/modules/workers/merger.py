from tests.stories.core.support.agent_labels import agent_number
from core.modules.messages.models.message import Message
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
import pytest
from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from engine.enums.access import Access
from engine.caller.caller_request import CallerRequest
from suites.coding.modules.workers.models.merger_line import MergerLine
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.driver.nudge import Nudge
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.drivers.models.agent_line import AgentLine
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_program_choice import HelperProgramChoice
from core.modules.helpers.commands.start_helper.start_helper_handler import StartHelperHandler
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.modules.processes.support.process_samples import install_runner
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator, UserBuilder
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, merged_worker_lines, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.merge import expect_marks_text
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, ended, queued_story, recording_launch
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from suites.coding.modules.workers.support.merger_nudges import MERGER_PASSED
from tests.stories.core.support.agent_labels import agent_label



class MergerStartError(RuntimeError):
    def __init__(self) -> None:
        super().__init__("merger start failed")


def merger_agent(story):
    agents = story.container.get(Queries).query(Agent).filter(profile="journal-merger").all_rows()
    return next(iter(agents), None)


@pytest.mark.parametrize("failure", ["limit", "outage", "sandbox", "no main agent", "unexpected error"])
def test_when_the_merger_cannot_start_the_main_agent_hears_what_waits(new_story, monkeypatch, failure):
    story, _, worker, started = queued_story(new_story, monkeypatch)
    reached = []

    def fail(*_args):
        reached.append(failure)
        if failure == "unexpected error":
            raise MergerStartError()
        raise Refusal(failure)

    failures = {
        "sandbox": lambda: monkeypatch.setattr(story.container.get(ShellSandbox), "check", fail),
        "no main agent": lambda: monkeypatch.setattr(AgentRows, "main_agent", lambda _rows: None),
        "limit": lambda: monkeypatch.setattr(HelperLimits, "checked_new_place", fail),
        "outage": lambda: monkeypatch.setattr(HelperProgramChoice, "startable", fail),
        "unexpected error": lambda: monkeypatch.setattr(StartHelperHandler, "prepare", fail),
    }
    monkeypatch.setattr(HelperLimits, "checked_launcher", lambda _limits: None)
    failures[failure]()
    ended(story, started[0], 0)
    story.expect_rows(failure == "no main agent" or reached == [failure])
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    notice = f"the tests of worker:{agent_number(story, worker.id)} all pass"
    story.expect_rows(lines.count(notice) == 1, "agent:0" not in lines, detail=lines)
    log = story.home.system_log
    story.expect_rows(not log.exists() or "merger start failed" not in FileAccess.shared().read(log))


def test_a_merge_waits_until_a_main_agent_returns(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    ended(story, started[0], 0)
    main = hook_agent(story, story.hook("new-main", HookSamples.session_start()))
    repository.checkout(ENVIRONMENT_BRANCH)
    def fail_sandbox():
        raise Refusal("sandbox unavailable")
    monkeypatch.setattr(story.container.get(ShellSandbox), "check", fail_sandbox)
    MergerRetry()(story.container)
    MergerRetry()(story.container)
    lines = story.run(f"agent-line list --agent {main.id}", actor=main).output_text
    story.expect_rows(lines.count(f"the tests of worker:{agent_number(story, worker.id)} all pass") == 1, detail=lines)


def test_a_retry_that_fails_again_does_not_repeat_the_line_once_the_main_agent_has_read_it(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    ended(story, started[0], 0)
    main = hook_agent(story, story.hook("new-main", HookSamples.session_start()))
    repository.checkout(ENVIRONMENT_BRANCH)

    def fail_sandbox():
        raise Refusal("sandbox unavailable")

    monkeypatch.setattr(story.container.get(ShellSandbox), "check", fail_sandbox)
    for _ in range(4):
        MergerRetry()(story.container)
        story.hook("new-main", HookSamples.prompt("go on"))
        story.clock.advance(timedelta(minutes=1))
    lines = story.run(f"agent-line list --agent {main.id}", actor=main).output_text
    story.expect_rows(lines.count(f"the tests of worker:{agent_number(story, worker.id)} all pass") == 1, detail=lines)


@pytest.mark.parametrize("merger_enabled", [True, False])
def test_delivery_with_only_checked_proofs_reaches_the_merger_or_main_agent(new_story, monkeypatch, merger_enabled):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"setting set journal.suites.coding.workers.merger-on {str(merger_enabled).lower()} --project", actor=story.user)
    repository = repository_environment(story)
    started = recording_launch(monkeypatch)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success(PROOF, actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_success("worker commit --wait --differences none", actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    story.expect_rows(not started)
    if merger_enabled:
        merger = merger_agent(story)
        story.expect_rows(merger is not None)
        story.expect_text("merger next", agent_label(story, worker.id), actor=Actor(merger.id, ActorType.AGENT))
    else:
        story.expect_rows(merger_agent(story) is None)
        story.expect_text(f"agent-line list --agent {story.agent.id}", f"the tests of worker:{agent_number(story, worker.id)} all pass", actor=story.agent)


def test_only_the_merger_runs_its_commands(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_refusal("merger next", "only the merger runs this", actor=story.agent)
    story.expect_refusal('merger pass 1 "odd"', "only the merger runs this", actor=story.agent)


def test_the_merger_reads_a_worker_merges_it_with_a_chat_mark_and_the_main_agent_is_nudged_once(new_story, monkeypatch):
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
    merger = merger_agent(story)
    story.expect_rows(merger is not None, merger.access == Access.READ)
    actor = Actor(merger.id, ActorType.AGENT)
    story.expect_text("merger next", agent_label(story, worker.id), "brief:", "proof 1", actor=actor)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success('setting set journal.suites.coding.workers.merger-commands \'["journal sins --branch={commit}"]\' --project', actor=story.user)
    story.expect_text(f"merger merge {agent_number(story, worker.id)}", f"{agent_label(story, worker.id)} merged into", "run: journal sins --branch=", actor=actor)
    story.expect_text("merger next", "no worker waits", actor=actor)
    expect_marks_text(story, f"Worker {worker.id} had")
    story.hook(merger.session, HookSamples.stop())
    merged_lines = merged_worker_lines(story, worker)
    story.expect_rows(len(merged_lines) == 1, merged_lines[0].wakes_agent, not any("could not be confirmed" in row.text for row in story.container.get(Queries).query(Message).filter(session_agent_id=merger.id).all_rows()))
    story.expect_success(f'merger findings {agent_number(story, worker.id)} "Fix the merged code"', actor=actor)
    story.run_listeners()
    mark = story.container.get(Queries).query(ChatMark).filter(text=f"The merger sent Worker {worker.id} back").first()
    story.expect_rows(mark.detail == "Fix the merged code")
    story.expect_text(f"agent-line list --agent {worker.id}", "Fix the merged code", actor=worker)
    story.expect_text("task list", "Fix the merged code", actor=worker)


def test_the_merger_and_a_worker_message_each_other_but_two_workers_do_not(new_story, monkeypatch):
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
    second_agent = Actor(story.new_row_id(f"agent start s-other claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success(f'merger advise {agent_number(story, worker.id)} "Rebase on main first"', actor=merger)
    story.expect_text(f"agent-line list --agent {worker.id}", f"agent:{agent_number(story, merger.id)} reports in message:", actor=worker)
    story.expect_success(f'message send "Rebased" --to agent:{agent_number(story, merger.id)}', actor=worker)
    story.expect_text(f"agent-line list --agent {merger.id}", f"agent:{agent_number(story, worker.id)} reports in message:", actor=merger)
    story.expect_refusal(f'message send "Hello" --to agent:{agent_number(story, second_agent.id)}', "not yours to message", actor=worker)


def test_a_workers_report_goes_to_the_merger_and_the_merger_tells_the_main_agent_what_it_must_act_on(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_success('worker report "Converted the window"', actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    story.expect_rows("Converted the window" not in story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text)
    merger = Actor(merger_agent(story).id, ActorType.AGENT)
    story.expect_text("merger next", "reports: Converted the window", actor=merger)
    story.expect_success('merger tell "Worker asks which reader to keep" --tried "Read the brief" --option "The first" --option "The second" --recommend "The first"', actor=merger)
    reported_message = story.container.get(Queries).query(Message).filter(session_agent_id=merger.id).first()
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).newest().first()
    story.expect_rows(reported_message is not None, line.state is AgentLineState.WAITING, line.wakes_agent, f"in message:{reported_message.id}" in line.text,
                      "Worker asks which reader to keep" not in line.text, detail=f"{line.state} {line.text}")
    story.expect_text(f"message read {reported_message.id}", "Worker asks which reader to keep", actor=story.agent)

    story.expect_success(f'merger findings {agent_number(story, worker.id)} "The tax is added twice"', actor=merger)
    expect_marks_text(story, f"The merger sent Worker {worker.id} back")
    mark = story.container.get(Queries).query(ChatMark).filter(text=f"The merger sent Worker {worker.id} back").first()
    story.expect_rows(mark.detail == "The tax is added twice")


def test_with_the_merger_on_a_workers_closing_words_do_not_reach_the_main_agent(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = delivered_worker(story, repository_environment(story))
    stop = HookSamples.stop()
    story.hook(worker_session(story, worker), stop.with_raw({**stop.body["raw"], "last_assistant_message": "Handed in all assigned work."}))
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows("Handed in all assigned work" not in lines, f"agent:{agent_number(story, worker.id)} reports" not in lines, detail=lines)


def test_merger_notices_combine_worker_numbers_without_reasons():
    notices = Nudge.collapsed([MERGER_PASSED.nudge(worker=6), MERGER_PASSED.nudge(worker=7), MERGER_PASSED.nudge(worker=8)])
    expect_merger_lines(notices, ["the merger leaves workers 6, 7, 8 to you: their merges wait on you"])


def expect_merger_lines(notices, expected):
    assert [notice.text for notice in notices] == expected


@pytest.mark.real_git
def test_a_blocked_merge_waits_until_the_checkout_is_committed(new_story, monkeypatch):
    monkeypatch.setattr(ClaudeCodeProvider, "session_matches_folder", lambda _provider, _folder, _session: True)
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
        merger = merger_agent(story)
        actor = Actor(merger.id, ActorType.AGENT)
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_text("merger next", agent_label(story, worker.id), actor=actor)
        (repository.folder / "cart.py").chmod(0o755)
        story.expect_refusal(f"merger merge {agent_number(story, worker.id)}", "uncommitted changes to cart.py", actor=actor)
        story.expect_success('merger tell "The merge waits for cart.py to be committed" --tried "Read the checkout" --option "Commit it" --option "Wait" --recommend "Commit it"', actor=actor)
        story.hook(merger.session, HookSamples.stop())
        story.expect_success(f"agent exited {merger.id} 0")
        story.run_listeners()
        jobs = story.container.get(HelperJobRows)
        job_count = len(jobs.helper_jobs(merger.id))
        MergerRetry()(story.container)
        MergerRetry()(story.container)
        story.expect_rows(len(jobs.helper_jobs(merger.id)) == job_count)
        reported_messages = [row for row in story.container.get(Queries).query(Message).filter(session_agent_id=merger.id).all_rows() if "The merge waits for cart.py to be committed" in row.text]
        story.expect_rows(len(reported_messages) == 1, detail=str(reported_messages))
        repository.git("add", "cart.py")
        repository.git("commit", "-m", "Commit main change")
        repository.checkout("main")
        MergerRetry()(story.container)
        story.expect_rows(len(jobs.helper_jobs(merger.id)) == job_count)
        repository.checkout(ENVIRONMENT_BRANCH)
        MergerRetry()(story.container)
        story.expect_rows(len(jobs.helper_jobs(merger.id)) == job_count + 1)
        MergerRetry()(story.container)
        story.expect_rows(len(jobs.helper_jobs(merger.id)) == job_count + 1)
        story.expect_text("merger next", agent_label(story, worker.id), actor=actor)
        story.expect_success(f"merger merge {agent_number(story, worker.id)}", actor=actor)
        story.expect_text("task show 1", "state: completed", actor=story.agent)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def test_the_merger_pass_shows_the_reason_on_the_worker_mark(new_story, monkeypatch):
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
    reason = "The main agent must decide which reader to keep"
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "{reason}"', actor=merger)
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "Another decision"', actor=merger)
    story.run_listeners()
    marks = tuple(story.container.get(Queries).query(ChatMark).filter(text=f"The merger left Worker {worker.id} to the main agent").oldest().all_rows())
    story.expect_rows(len(marks) == 2, marks[0].detail == reason, marks[1].detail == "Another decision", marks[0].target_id == worker.id)


@pytest.mark.parametrize("exit_line, fault", [("agent exited {agent} 0", False), ("agent end {agent}", False), ("agent exited {agent} 137", True)])
def test_the_merger_ending_without_a_report_does_not_notify_the_main_agent(new_story, monkeypatch, exit_line, fault):
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
    merger = merger_agent(story)
    story.expect_success(exit_line.format(agent=merger.id), actor=Actor(merger.id, ActorType.AGENT))
    story.run_listeners()
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "It ended without a report")
    lines = story.run(f"agent-line list --agent {story.agent.id}").output_text
    story.expect_rows((f"agent:{agent_number(story, merger.id)} program exited with code 137" in lines) == fault)
    story.expect_rows(story.container.get(HelperJobRows).open_job(merger.id) is None)


def test_a_worker_left_to_the_main_agent_is_not_reported_as_stopped(new_story, monkeypatch):
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
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "A decision is needed"', actor=merger)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.advance(timedelta(minutes=20))
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} has stopped")


def test_long_merger_lines_wait_until_the_output_is_read_whole(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_success(f'worker report "{"important line " * 40}"', actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = merger_agent(story)
    main = story.agent
    story.agent = Actor(merger.id, ActorType.AGENT)
    process = start_process(story, "journal merger next && echo done")
    request = CallerRequest({"JOURNAL_AGENT_SESSION": merger.session, "JOURNAL_PROCESS": str(process.id)}, str(repository.folder))
    output = story.run_requested("merger next", request)
    output.expect_code(0)
    line = story.container.get(Queries).query(MergerLine).first()
    story.expect_rows(line.read_at is None, line.read_output_id == process.id)
    end_run(story, process, output.output_text)
    story.expect_success(f"output read {process.id} --all", actor=story.agent)
    line = story.container.get(Queries).query(MergerLine).find(line.id)
    story.expect_rows(line.read_at is not None, line.read_output_id is None)
    story.agent = main


def test_the_merger_is_told_to_read_a_merge_that_moved_to_the_background_before_calling_it_unconfirmed(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    profile = story.container.get(ProfileFiles).effective("journal-merger")
    story.expect_rows("journal output read <n> --summary" in profile.body, "never tell the main agent a merge is unconfirmed while its output still runs" in profile.body)


def test_a_merge_the_merger_starts_runs_in_the_foreground_and_is_reported_once_and_confirmed_by_next(new_story, monkeypatch):
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
    merger = merger_agent(story)
    install_runner(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    line = f"journal merger merge {agent_number(story, worker.id)}"
    reply = story.hook(merger.session, HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, ["merger", "merge", str(worker.id)], subcommand="merger")))
    rewritten = str(reply.updated_input)
    story.expect_rows("--limit 0" in rewritten, "--queue" not in rewritten, "--background" not in rewritten)
    actor = Actor(merger.id, ActorType.AGENT)
    story.expect_text("merger next", agent_label(story, worker.id), actor=actor)
    story.expect_text(f"merger merge {agent_number(story, worker.id)}", f"{agent_label(story, worker.id)} merged into", actor=actor)
    story.expect_text("merger next", "no worker waits", actor=actor)
    story.expect_rows(len(merged_worker_lines(story, worker)) == 1, not any("could not be confirmed" in row.text for row in story.container.get(Queries).query(Message).filter(session_agent_id=merger.id).all_rows()))


def test_explaining_a_merge_runs_the_merge_inside_the_explanation_without_the_transaction_error(new_story, monkeypatch):
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
    actor = Actor(merger_agent(story).id, ActorType.AGENT)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_text("merger next", agent_label(story, worker.id), actor=actor)
    story.expect_success(f"merger merge {agent_number(story, worker.id)} --explain", actor=actor)
    story.expect_rows(len(merged_worker_lines(story, worker)) == 0)


def test_a_planner_helper_ending_starts_no_merger(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.suites.coding.workers.merger-on true --project", actor=story.user)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run('helper start journal-planner --brief "Plan the change" --environment main', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    planner = next(story.container.get(Queries).query(Agent).filter(profile="journal-planner").all_rows())
    story.expect_success(f"agent end {planner.id}", actor=story.user)
    story.run_listeners()
    MergerRetry()(story.container)
    story.run_listeners()
    story.expect_rows(merger_agent(story) is None, len(story.story_rows(MergerLine)) == 0)


def test_a_worker_the_merger_ended_without_taking_in_is_named_to_the_main_agent_after_the_wait(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    repository.checkout(ENVIRONMENT_BRANCH)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = merger_agent(story)
    story.expect_success(f"agent end {merger.id}", actor=Actor(merger.id, ActorType.AGENT))
    story.run_listeners()
    reminder = f"worker:{agent_number(story, worker.id)} delivered"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick("s-1")
    story.expect_rows(reminder not in story.run(main_lines).output_text)
    story.advance(timedelta(minutes=15))
    story.tick("s-1")
    story.expect_rows(reminder in story.run(main_lines).output_text)


def test_a_worker_the_merger_passes_on_is_named_to_the_main_agent_with_its_merge_waiting_and_named_again_after_the_wait(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    repository.checkout(ENVIRONMENT_BRANCH)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = Actor(merger_agent(story).id, ActorType.AGENT)
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "important differences need the main agent"', actor=merger)
    story.run_listeners()
    story.expect_text(main_lines, f"the merger leaves worker:{agent_number(story, worker.id)} to you: its merge waits on you")
    story.tick("s-1")
    story.expect_text(main_lines, f"worker:{agent_number(story, worker.id)} delivered")
    first = story.run(main_lines).output_text.count(f"worker:{agent_number(story, worker.id)} delivered")
    story.advance(timedelta(minutes=15))
    story.tick("s-1")
    story.expect_rows(story.run(main_lines).output_text.count(f"worker:{agent_number(story, worker.id)} delivered") > first)
