from types import SimpleNamespace

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.commands.refresh_agent_pin.refresh_agent_pin import RefreshAgentPin
from core.modules.drivers.listeners.new_job_pin_listener import NewJobPinListener
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.agent_pins import AgentPins
from core.modules.drivers.support.contribution_slices import SAFETY_SLICE, WAITING_SLICE
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING
from tests.stories.core.support.coding_fixtures import BuilderStarted


def slices_on(story, *names: str) -> None:
    listed = ", ".join(f'"{name}"' for name in names)
    story.expect_success(f"setting set {ACTIVE_SLICES_SETTING} '[{listed}]'", actor=story.user)


def test_a_new_work_generation_pins_the_agent_to_a_slice_switched_on_since_its_session_started(played):
    story = played(BuilderStarted)
    slices_on(story, WAITING_SLICE)
    story.hook("s-1", HookSamples.session_start())
    slices_on(story, WAITING_SLICE, SAFETY_SLICE)
    with story.container.get(Scopes).read_scope((), None, 1), story.container.get(Database).transaction():
        story.container.get(AgentPins).repinned(story.agent.id, Context(Actor.core(), story.clock.timestamp(), RefreshAgentPin(story.agent.id)))
    stack = story.container.get(Queries).query(AgentStack).filter(session_agent_id=story.agent.id).first()
    assert stack is not None and tuple(stack.pinned_slices) == tuple(sorted((SAFETY_SLICE, WAITING_SLICE)))


def test_a_job_repins_its_helper_once_it_is_bound():
    repinned: list[int] = []
    listener = NewJobPinListener(SimpleNamespace(repinned=lambda agent_id, context: repinned.append(agent_id)))
    listener.handle(SimpleNamespace(row=SimpleNamespace(helper_id=5), old_row=SimpleNamespace(helper_id=None)), None)
    listener.handle(SimpleNamespace(row=SimpleNamespace(helper_id=5), old_row=SimpleNamespace(helper_id=5)), None)
    assert repinned == [5]
