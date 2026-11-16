from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.enums.tool_type import ToolType
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.agent_messages.paused_refusal_message import PausedRefusalMessage
from tests.stories.core.support.coding_fixtures import ReadTaskBuilder

READ = HookSamples.tool_use("Read", ToolType.READ, ["src/cart.py"], None).with_fields(event_id="replayed-read")
EDIT = HookSamples.edit("src/cart.py").with_fields(event_id="replayed-edit")


def paused_after(story, sample):
    first = story.hook("s-1", sample)
    story.expect_success(f"agent pause {story.container.get(AgentRows).find(story.agent.id).number}", actor=story.user)
    return first, story.hook("s-1", sample)


def test_a_replayed_read_passes_a_pause_since_its_stored_answer(played):
    story = played(ReadTaskBuilder)
    first, repeat = paused_after(story, READ)
    assert not first.refusal and not repeat.refusal


def test_a_replayed_edit_is_refused_by_a_pause_since_and_the_call_records_it(played):
    story = played(ReadTaskBuilder)
    first, repeat = paused_after(story, EDIT)
    paused_text = PausedRefusalMessage.declared().agent_message().text
    call = story.container.get(Queries).query(HookCall).all_environments("one test's hook").filter(event_id="replayed-edit").first()
    assert not first.refusal and repeat.refusal == paused_text and call is not None and call.repeated_answer == paused_text
