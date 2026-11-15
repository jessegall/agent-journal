from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT = HookSamples.edit("src/cart.py")
OVERVIEW_SLICE = "blocked.overview"


def edit_after_start(story):
    story.hook("s-1", HookSamples.session_start())
    return story.hook("s-1", EDIT)


def test_with_the_overview_slice_on_the_new_driver_opens_its_block_and_refuses_in_todays_words(played):
    today = played(BuilderStarted)
    story = played(BuilderStarted)
    # a person sets the part active past its phase gate, which journal driver set-active keeps closed until the gate passes
    story.expect_success(f"setting set {ACTIVE_SLICES_SETTING} '[\"{OVERVIEW_SLICE}\"]'", actor=story.user)
    reply = edit_after_start(story)
    queries = story.container.get(Queries)
    stack = queries.query(AgentStack).filter(session_agent_id=story.agent.id).first()
    assert stack is not None and tuple(stack.pinned_slices) == (OVERVIEW_SLICE,)
    assert reply.refusal in [block.nudge_text for block in queries.query(AgentBlock).filter(session_agent_id=story.agent.id).every_row("one agent of one test")]
    assert reply.refusal and reply.refusal == edit_after_start(today).refusal
