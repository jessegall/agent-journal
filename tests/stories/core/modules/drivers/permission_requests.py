from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.driver.tool_type import ToolType
from engine.query.queries import Queries
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.permission_request import PermissionRequest
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

DESIGN = "docs/designs/cart/page.html"
REFUSED = "reads and searches only"


def design_edit(path: str = DESIGN):
    return HookSamples.tool_use("Edit", ToolType.EDIT, [path], None)


def requests(story) -> list[PermissionRequest]:
    return list(story.container.get(Queries).query(PermissionRequest).all_rows())


def helper_story(new_story):
    story = new_story(fixture=StartedHelper)
    agent = helper_agent(story)
    return story, agent.session, Actor(agent.id, ActorType.AGENT)


def test_a_helpers_write_is_refused_asked_allowed_once_and_run_and_a_second_run_is_refused(new_story):
    story, session, helper = helper_story(new_story)
    story.expect_hook_refusal(session, design_edit(), REFUSED)
    story.expect_success(f'permission ask {DESIGN} --reason "save the design page"', actor=helper)
    story.expect_rows(requests(story)[0].state is PermissionState.REQUESTED)
    story.expect_hook_refusal(session, design_edit(), REFUSED)
    story.expect_success("permission allow 1", actor=story.agent)
    story.expect_hook_allowed(session, design_edit())
    story.expect_rows(requests(story)[0].state is PermissionState.USED)
    story.expect_hook_refusal(session, design_edit(), REFUSED)


def test_an_allowed_request_lets_through_only_the_thing_it_named(new_story):
    story, session, helper = helper_story(new_story)
    story.expect_success(f'permission ask {DESIGN} --reason "save the design page" --person', actor=helper)
    story.expect_rows(requests(story)[0].needs_person)
    story.expect_hook_refusal(session, design_edit("docs/designs/cart/other.html"), REFUSED)


def test_a_declined_request_leaves_the_helper_refused(new_story):
    story, session, helper = helper_story(new_story)
    story.expect_success(f'permission ask {DESIGN} --reason "save the design page again"', actor=helper)
    story.expect_success("permission decline 1", actor=story.agent)
    story.expect_rows(requests(story)[0].state is PermissionState.DECLINED)
    story.expect_hook_refusal(session, design_edit(), REFUSED)
    story.expect_refusal("permission allow 1", "", actor=story.agent)


def test_the_asker_cannot_answer_its_own_request(new_story):
    story, session, helper = helper_story(new_story)
    story.expect_success(f'permission ask {DESIGN} --reason "save the design page, please"', actor=helper)
    story.expect_refusal("permission allow 1", "only the main agent", actor=helper)
