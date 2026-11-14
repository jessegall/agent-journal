from engine.driver.agent_state import AgentState
from engine.driver.deferred_rule import DeferredRule
from engine.driver.driver import Driver
from engine.module.suite import Suite


# @righteous architecture_drivers_driver_piece_without_a_name
class SampleSuite(Suite):
    name = "samples"


# @sin architecture_drivers_driver_piece_without_a_name
class SampleDriver(Driver):
    suite = "samples"


# @righteous architecture_drivers_driver_piece_without_a_name
class SampleNamedState(AgentState):
    name = "samples.named"


# @sin architecture_drivers_driver_piece_without_a_name
class SampleUnnamedState(AgentState):
    tier = None


# @sin architecture_drivers_driver_piece_without_a_name
class SampleUnnamedDeferred(DeferredRule):
    hook = None
