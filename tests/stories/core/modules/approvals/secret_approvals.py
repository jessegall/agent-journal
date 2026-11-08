import pytest

from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.secrets.models.secret import Secret
from tests.stories.core.modules.secrets.support.secret_fixtures import SecretMade
from tests.stories.core.modules.secrets.support.private_home import VALUE, private_folder

__all__ = ["private_folder"]
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def secret_story(new_story, private_folder):
    story = new_story(fixture=SecretMade)
    with viewer_client(story) as viewer:
        viewer.value("secrets.secrets", ["secret", "fill", "1", "key", VALUE])
    return story


@pytest.fixture(params=["secret propose 1 head --reason needed", "secret allow 1 head --reason needed", "secret run 1 --reason needed -- head -c 64"])
def pending_program(secret_story, request):
    story = secret_story
    outcome = story.run(request.param, actor=story.agent)
    story.expect_rows("person was asked in the dock" in outcome.output_text)
    story.run_listeners()
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None, detail=outcome.output_text)
    story.expect_rows(request.arguments == ("secret", "allow", "1", "head"))
    return story, request


@pytest.fixture
def program_viewer(pending_program):
    with viewer_client(pending_program[0]) as viewer:
        yield viewer


@pytest.mark.parametrize("decision,expected", [("accept", True), ("refuse", False)])
def test_program_permission_uses_the_persons_dock_decision(pending_program, program_viewer, decision, expected):
    story, request = pending_program
    answer = program_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    secret = story.container.get(Queries).query(Secret).find(1)
    story.expect_rows(("head" in secret.programs) is expected)
    if request.continued_arguments and expected:
        story.expect_rows("[secret GITHUB_KEY]" in answer["viewer_output"], VALUE not in answer["viewer_output"])
