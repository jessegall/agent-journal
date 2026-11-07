from core.base.access import Access
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.nudge import Nudge
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from core.modules.drivers.models.agent_line import AgentLine
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import ended, queued_story
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from suites.coding.modules.workers.support.merger_nudges import MERGER_MERGED, MERGER_PASSED



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


def test_the_merger_reads_a_worker_merges_it_and_the_main_agent_hears_one_line(new_story, monkeypatch):
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
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the merger merged worker:{worker.id}", actor=story.agent)
    notices = list(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source="merger").all_rows())
    expect_merged_declaration(notices)
    story.expect_text("merger next", "no worker waits", actor=actor)


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


def expect_merged_declaration(notices):
    assert any(line.nudge.key == "workers.merger_merged" for line in notices), [(line.text, line.nudge.key) for line in notices]


def test_merger_notices_combine_workers_but_keep_different_reasons_separate():
    notices = Nudge.collapsed([MERGER_MERGED.nudge(worker=4), MERGER_MERGED.nudge(worker=5),
                               MERGER_PASSED.nudge(worker=6, reason="Needs a decision"), MERGER_PASSED.nudge(worker=7, reason="Needs a decision"),
                               MERGER_PASSED.nudge(worker=8, reason="Has conflicts")])
    expect_merger_lines(notices, ["the merger merged workers 4, 5",
                                 "the merger leaves workers 6, 7 to you: Needs a decision. Read journal worker logs <id> for each",
                                 "the merger leaves worker:8 to you: Has conflicts. Read journal worker logs 8"])


def expect_merger_lines(notices, expected):
    assert [notice.text for notice in notices] == expected
