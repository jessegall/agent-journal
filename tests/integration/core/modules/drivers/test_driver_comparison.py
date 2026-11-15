from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_comparison import DriverComparison
from core.modules.drivers.models.driver_comparison_stack import DriverComparisonStack
from core.modules.drivers.support.driver_settings import COMPARISON_SETTING
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT = HookSamples.edit("src/cart.py")


def test_a_compared_hook_saves_both_answers_beside_the_live_one_and_writes_no_live_stack(played):
    story = played(BuilderStarted)
    story.expect_success(f"setting set {COMPARISON_SETTING} true", actor=story.user)
    reply = story.hook("s-1", EDIT)
    queries = story.container.get(Queries)
    comparison = queries.query(DriverComparison).filter(session_agent_id=story.agent.id).newest().first()
    assert comparison is not None and comparison.hook_call_id == reply.hook_call_id
    assert comparison.old_answer.startswith("refuse") == bool(reply.refusal) and comparison.new_answer
    assert queries.query(DriverComparisonStack).filter(session_agent_id=story.agent.id).first() is not None
    assert queries.query(AgentStack).filter(session_agent_id=story.agent.id).first() is None


def test_with_the_comparison_off_a_hook_saves_no_comparison(played):
    story = played(BuilderStarted)
    story.hook("s-1", EDIT)
    assert story.container.get(Queries).query(DriverComparison).filter(session_agent_id=story.agent.id).first() is None
