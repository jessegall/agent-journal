import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.query.queries import Queries
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SETTING = "journal.suites.coding.workers.protected-folders"


@pytest.fixture
def protected_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
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


def test_a_worker_cannot_hand_in_a_protected_change(protected_worker):
    story, repository, worker = protected_worker
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success(FIRST_PROOF, actor=worker)
    story.expect_refusal(DELIVERY, "cart.py is protected", actor=worker)


def test_a_main_agent_may_edit_a_protected_path(protected_worker):
    story, repository, _ = protected_worker
    story.expect_hook_allowed("s-1", HookSamples.edit(str(repository.folder / "cart.py")))


def test_only_the_main_agent_can_ask_a_person_to_change_the_list(protected_worker):
    story, _, worker = protected_worker
    line = f"setting set {SETTING} '[\"other.py\"]' --project"
    story.expect_refusal(line, "only the main agent can ask", actor=worker)
    story.expect_refusal(line, "A person was asked in the dock", actor=story.agent)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(approval is not None, approval.arguments[:3] == ("setting", "set", SETTING))
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(approval.id)])
