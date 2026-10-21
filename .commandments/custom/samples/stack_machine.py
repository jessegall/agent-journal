from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.held import Held
from journal.engine.support.stack import Stack
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.events.rows.task_closed import TaskClosed
from journal.support.decision import Decision


@dataclass(frozen=True)
class Sinning(BaseState):
    name = "sinning"

    # @sin StateListenerNotOnDetector
    def tool_starting(self, event: ToolStarting, settings) -> Transition:
        return self.unchanged()

    # @sin OnListenerWithoutEventTypeDetector
    def on_tool_finished(self, event, settings) -> Transition:
        return self.unchanged()

    # @sin StateHearsUpdatedDetector
    def on_updated(self, event: Updated, settings) -> Transition:
        # @sin StateReadsWasDetector
        return self.unchanged() if event.was else self.pop()

    # @sin StateHearsModelEventDetector
    def on_model_event(self, event: ModelEvent, settings) -> Transition:
        return self.unchanged()

    # @sin TransitionOutsideBaseStateDetector
    def on_task_closed(self, event: TaskClosed, settings) -> Transition:
        return Transition(self)

    # @sin HookThatMovesDetector
    def on_pop(self, settings):
        return self.pop()

    def on_suspend(self, settings):
        # @sin HeldOutsideOnPushDetector
        return Held(None)


@dataclass(frozen=True)
class Righteous(BaseState):
    name = "righteous"

    # @righteous StateListenerNotOnDetector
    # @righteous OnListenerWithoutEventTypeDetector
    # @righteous StateHearsUpdatedDetector
    def on_tool_starting(self, event: ToolStarting, settings) -> Transition:
        # @righteous TransitionOutsideBaseStateDetector
        return self.unchanged()

    def on_push(self, settings):
        # @righteous HeldOutsideOnPushDetector
        return Held(None)

    # @righteous HookThatMovesDetector
    def on_resume(self, snapshot, settings):
        return self.pop()


class Speaking(AgentListener[ToolStarting]):
    # @sin FeatureListenerSpeaksDetector
    def handle(self, event: ToolStarting) -> Decision:
        return Decision.refuse("no")


class Recording(AgentListener[ToolStarting]):
    # @righteous FeatureListenerSpeaksDetector
    def handle(self, event: ToolStarting) -> None:
        self.entries.save(event)


def outside(bus, stack: Stack):
    # @sin StackBuiltOutsideEngineDetector
    built = Stack(())
    # @sin StackChangedOutsideEngineDetector
    built.pushed(None)
    # @sin DispatchOutsideFunnelsDetector
    bus.dispatch(stack)


def inside(plans, plan):
    # @righteous DispatchOutsideFunnelsDetector
    # @righteous StackBuiltOutsideEngineDetector
    plans.save(plan.started(None, 0.0), None)
