from tests.stories.suites.coding.modules.workers.merger import expect_merger_lines

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
from engine.actor.actor import Actor
from engine.driver.agent_message import AgentMessage
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from suites.coding.modules.workers.agent_messages.merger_passed_message import MergerPassedMessage
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from tests.integration.suites.coding.modules.workers.test_test_queue import ended, queued_story

TEST_ROWS_REASON = "the test reads every row it checks"
OVERSIGHT_SETTING = "journal.suites.coding.workers.oversight-profiles"
OVERSEEING_PROFILE = RESEARCHER_PROFILE.name


class MergerStartError(RuntimeError):
    def __init__(self) -> None:
        super().__init__("merger start failed")


def merger_agent(story):
    agents = story.container.get(Queries).query(Agent).filter(profile=f"{MERGER_PROFILE.name}").every_row(TEST_ROWS_REASON)
    return next(iter(agents), None)


def ended_merger_lines(new_story, monkeypatch, end) -> tuple[object, str]:
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    try:
        ended(story, started[0], 0)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    merger = merger_agent(story)
    end(story, Actor(merger.id, ActorType.AGENT))
    story.run_listeners()
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "It ended without a report")
    story.expect_rows(story.container.get(HelperJobRows).open_job(merger.id) is None)
    return story, story.run(f"agent-line list --agent {story.agent.id}").output_text


def test_merger_notices_combine_worker_numbers_without_reasons():
    notices = AgentMessage.collapsed([MergerPassedMessage.declared().agent_message(worker=6), MergerPassedMessage.declared().agent_message(worker=7), MergerPassedMessage.declared().agent_message(worker=8)])
    expect_merger_lines(notices, ["the merger leaves workers 6, 7, 8 to you: their merges wait on you"])
