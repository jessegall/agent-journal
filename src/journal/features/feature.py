from typing import ClassVar

from journal.console.command import Command
from journal.engine.agent_state import AgentState
from journal.support.entry import Entry
from journal.events.listener import Listener
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.features.seed import Seed
from journal.features.support.service import Service
from journal.support.skill import Skill


class Feature:
    """One switchable subject. It brings its states, its nudges, its state-free listeners, its commands, and the checks and actions a workflow may name; nothing else knows a feature exists."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    help: ClassVar[str] = ""
    states: ClassVar[tuple[type[AgentState], ...]] = ()
    nudges: ClassVar[tuple[Nudge, ...]] = ()
    options: ClassVar[tuple[Option, ...]] = ()
    listeners: ClassVar[tuple[type[Listener], ...]] = ()
    checks: ClassVar[tuple[Entry, ...]] = ()
    actions: ClassVar[tuple[Entry, ...]] = ()
    commands: ClassVar[tuple[type[Command], ...]] = ()
    seeds: ClassVar[tuple[type[Seed], ...]] = ()
    skill: ClassVar[Skill | None] = None
    services: ClassVar[tuple[Service, ...]] = ()
    default: ClassVar[bool] = True
