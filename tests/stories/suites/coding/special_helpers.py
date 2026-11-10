from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.support.coding_fixtures import UserBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, recording_launch
from tests.stories.support.story_checks import expect_value

DESIGNER = "journal.suites.coding.designer-enabled"
HELPERS = "journal.suites.coding.main-starts-read-only-helpers"
MERGER = "journal.suites.coding.workers.merger-on"
START_DESIGNER = 'helper start journal-designer --brief "Design the cart page" --environment main'


def read_merger(story):
    return next(iter(story.container.get(Queries).query(Agent).filter(profile="journal-merger").all_rows()), None)


def merger_delivery(story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    recording_launch(monkeypatch)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success(PROOF, actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_success("worker deliver --wait --differences none", actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    return worker


def test_s05_the_merger_takes_in_workers_while_ordinary_helpers_are_off(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.run(f"setting set {HELPERS} off --project")
    worker = merger_delivery(story, monkeypatch)
    merger = read_merger(story)
    story.expect_rows(merger is not None)
    story.expect_text("merger next", f"worker {worker.id}", actor=Actor(merger.id, ActorType.AGENT))


def test_s07_the_designer_starts_only_once_a_person_turns_it_on_and_reads_without_writing(new_story):
    story = new_story(fixture=UserBuilder)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), request_count=1)
    story.expect_refusal(START_DESIGNER, "starts no designer", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_success(f"setting set {DESIGNER} on --environment main", actor=story.user)
    helper_id, launcher = started(story, START_DESIGNER)
    story.expect_text(f"agent show {helper_id}", "profile: journal-designer", "access: read", actor=story.user)


def test_s48_the_merger_keeps_its_claim_after_the_merger_setting_is_turned_off(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = merger_delivery(story, monkeypatch)
    merger = read_merger(story)
    story.expect_success(f"setting set {MERGER} off --project", actor=story.user)
    expect_value(read_merger(story).id, merger.id)
    story.expect_text("merger next", f"worker {worker.id}", actor=Actor(merger.id, ActorType.AGENT))
