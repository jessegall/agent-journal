from core.base.access import Access
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.shell_sandbox import ShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
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
    story.expect_text(f"merger merge {worker.id}", "journal sins --branch=", actor=actor)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the merger merged worker:{worker.id}", actor=story.agent)
    story.expect_text("merger next", "no worker waits", actor=actor)
