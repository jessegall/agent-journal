from core.testing.hook_samples import HookSamples
from core.base.access import Access
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.chat.models.chat_mark import ChatMark
from core.base.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.merge import expect_marks_text
from tests.stories.suites.coding.modules.workers.test_queue import ended, queued_story
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH



def merger_of(story):
    agents = story.container.get(Queries).query(Agent).filter(profile="journal-merger").all_rows()
    return next(iter(agents), None)


def test_with_the_setting_off_the_main_agent_hears_that_the_tests_passed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_rows(merger_of(story) is None)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)


def test_only_the_merger_runs_its_commands(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_refusal("merger next", "only the merger runs this", actor=story.agent)
    story.expect_refusal('merger pass 1 "odd"', "only the merger runs this", actor=story.agent)


def test_the_merger_reads_a_worker_merges_it_with_a_chat_mark_and_the_main_agent_hears_one_line(new_story, monkeypatch):
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
    merger = merger_of(story)
    story.expect_rows(merger is not None, merger.access == Access.READ)
    actor = Actor(merger.id, ActorType.AGENT)
    story.expect_text("merger next", f"worker {worker.id}", "brief:", "proof 1", actor=actor)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success('setting set journal.suites.coding.workers.merger-commands \'["journal sins --branch={commit}"]\' --project', actor=story.user)
    story.expect_text(f"merger merge {worker.id}", "run: journal sins --branch=", actor=actor)
    story.expect_text("merger next", "no worker waits", actor=actor)
    expect_marks_text(story, f"Worker {worker.id} had")
    story.hook(merger.session, HookSamples.stop())
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows(f"the merger merged worker:{worker.id}" in lines, f"agent:{merger.id} reports" not in lines, detail=lines)
    story.expect_success(f'merger findings {worker.id} "Fix the merged code"', actor=actor)
    story.run_listeners()
    mark = story.container.get(Queries).query(ChatMark).filter(text=f"The merger sent Worker {worker.id} back").first()
    story.expect_rows(mark.detail == "Fix the merged code")
    story.expect_text(f"agent-line list --agent {worker.id}", "Fix the merged code", actor=worker)
    story.expect_text("task list", "Fix the merged code", actor=worker)


def test_a_workers_report_goes_to_the_merger_and_the_merger_tells_the_main_agent_what_it_must_act_on(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        story.expect_success('worker report "Converted the window"', actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    story.expect_rows("Converted the window" not in story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text)
    merger = Actor(merger_of(story).id, ActorType.AGENT)
    story.expect_text("merger next", "reports: Converted the window", actor=merger)
    story.expect_success('merger tell "Worker asks which reader to keep"', actor=merger)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "Worker asks which reader to keep", actor=story.agent)
    story.expect_success(f'merger findings {worker.id} "The tax is added twice"', actor=merger)
    expect_marks_text(story, f"The merger sent Worker {worker.id} back")
    mark = story.container.get(Queries).query(ChatMark).filter(text=f"The merger sent Worker {worker.id} back").first()
    story.expect_rows(mark.detail == "The tax is added twice")


def test_with_the_merger_on_a_workers_closing_words_do_not_reach_the_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    worker = delivered_worker(story, repository_environment(story))
    stop = HookSamples.stop()
    story.hook(worker_session(story, worker), stop.with_raw({**stop.body["raw"], "last_assistant_message": "Handed in all assigned work."}))
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows("Handed in all assigned work" not in lines, f"agent:{worker.id} reports" not in lines, detail=lines)


def test_a_blocked_merge_waits_until_the_checkout_is_committed(new_story, monkeypatch):
    monkeypatch.setattr(ClaudeCodeProvider, "session_resumes_here", lambda _provider, _folder, _session: True)
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
        merger = merger_of(story)
        actor = Actor(merger.id, ActorType.AGENT)
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_text("merger next", f"worker {worker.id}", actor=actor)
        (repository.folder / "cart.py").chmod(0o755)
        story.expect_refusal(f"merger merge {worker.id}", "uncommitted changes to cart.py", actor=actor)
        story.expect_success('merger tell "The merge waits for cart.py to be committed"', actor=actor)
        story.hook(merger.session, HookSamples.stop())
        story.expect_success(f"agent exited {merger.id} 0")
        story.run_listeners()
        jobs = story.container.get(HelperJobRows)
        job_count = len(jobs.helper_jobs(merger.id))
        MergerRetry()(story.container)
        MergerRetry()(story.container)
        story.expect_rows(len(jobs.helper_jobs(merger.id)) == job_count)
        lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
        story.expect_rows(lines.count("The merge waits for cart.py to be committed") == 1)
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
        story.expect_text("merger next", f"worker {worker.id}", actor=actor)
        story.expect_success(f"merger merge {worker.id}", actor=actor)
        story.expect_text("task show 1", "state: completed", actor=story.agent)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
