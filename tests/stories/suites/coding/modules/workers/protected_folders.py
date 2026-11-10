import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from engine.query.queries import Queries
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SETTING = "journal.suites.coding.workers.protected-folders"


@pytest.fixture
def protected_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    with viewer_client(story) as viewer:
        viewer.value("settings.settings", ["setting", "set", SETTING, '["cart.py"]', "--project"])
    worker = dispatched_worker(story)
    return story, repository, worker


def test_a_worker_cannot_edit_or_write_a_protected_path(protected_worker):
    story, _, worker = protected_worker
    session = worker_session(story, worker)
    story.expect_hook_refusal(session, HookSamples.edit("cart.py"), "cart.py is protected")
    part = ShellPart("printf", CommandCategory.EDIT, ["text"], effects=[CommandEffect.WRITES_FILES], output_paths=["cart.py"])
    story.expect_hook_refusal(session, HookSamples.shell("printf text > cart.py", part, redirects=["> cart.py"]), "cart.py is protected")
    story.expect_hook_allowed(session, HookSamples.edit("other.py"))


def test_a_main_agent_may_edit_a_protected_path(protected_worker):
    story, repository, _ = protected_worker
    story.expect_hook_allowed("s-1", HookSamples.edit(str(repository.folder / "cart.py")))


def test_only_the_main_agent_can_ask_a_person_to_change_the_list(protected_worker):
    story, _, worker = protected_worker
    line = f"setting set {SETTING} '[\"other.py\"]' --project"
    story.expect_refusal(line, "only the main agent can ask", actor=worker)
    story.expect_refusal(f"{line} --reason needed", "A person was asked in the dock", actor=story.agent)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(approval is not None, approval.arguments[:3] == ("setting", "set", SETTING))
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(approval.id)])
