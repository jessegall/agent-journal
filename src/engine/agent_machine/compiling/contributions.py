from dataclasses import dataclass

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.needs.wake_cause import WakeCause
from engine.agent_machine.needs.fact_source import FactSource
from engine.agent_machine.needs.need_source import NeedSource
from engine.driver.block_condition import BlockCondition
from engine.model.model import Model


@dataclass(frozen=True)
class Contributions:
    """The ten lists one module gives the agent machine, each of classes that carry their own metadata."""

    needs: tuple[type[NeedSource], ...] = ()
    facts: tuple[type[FactSource], ...] = ()
    policies: tuple[type[Policy], ...] = ()
    lines: tuple[type[LineSource], ...] = ()
    transforms: tuple[type[Transform], ...] = ()
    effects: tuple[type[Effect], ...] = ()
    wake_causes: tuple[type[WakeCause], ...] = ()
    subjects: tuple[type[Model], ...] = ()
    agent_listeners: tuple[type[AgentListener[object]], ...] = ()
    block_conditions: tuple[type[BlockCondition], ...] = ()
