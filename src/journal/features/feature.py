from typing import ClassVar

from journal.console.command import Command
from journal.engine.agent_state import AgentState
from journal.features.listener import Listener
from journal.features.nudge import Nudge
from journal.features.skill import Skill


class Feature:
    """One switchable subject. It brings its states, its nudges, its state-free listeners and its commands; nothing else knows a feature exists."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    help: ClassVar[str] = ""
    states: ClassVar[tuple[type[AgentState], ...]] = ()
    nudges: ClassVar[tuple[Nudge, ...]] = ()
    listeners: ClassVar[tuple[type[Listener], ...]] = ()
    commands: ClassVar[tuple[type[Command], ...]] = ()
    skill: ClassVar[Skill | None] = None
    default: ClassVar[bool] = True
