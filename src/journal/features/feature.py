from pathlib import Path
from typing import ClassVar

from journal.console.command import Command
from journal.engine.conduct import Conduct
from journal.engine.agent_state import AgentState
from journal.events.listener import Listener
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.features.seed import Seed
from journal.features.support.service import Service
from journal.support.skill import Skill


class Feature:
    """One switchable subject. It brings its states, its nudges, its state-free listeners and its commands; nothing else knows a feature exists."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    help: ClassVar[str] = ""
    fixed: ClassVar[bool] = False
    """Always on: the settings page shows it with no switch, since turning it off would only break what it does."""
    states: ClassVar[tuple[type[AgentState], ...]] = ()
    nudges: ClassVar[tuple[Nudge, ...]] = ()
    options: ClassVar[tuple[Option, ...]] = ()
    listeners: ClassVar[tuple[type[Listener], ...]] = ()
    snapshot: ClassVar[tuple[type, ...]] = ()
    conduct: ClassVar[tuple[type[Conduct], ...]] = ()
    commands: ClassVar[tuple[type[Command], ...]] = ()
    seeds: ClassVar[tuple[type[Seed], ...]] = ()
    skill: ClassVar[Skill | None] = None
    services: ClassVar[tuple[Service, ...]] = ()
    default: ClassVar[bool] = True

    @classmethod
    def applies_in(cls, root: Path) -> bool:
        """Whether the feature means anything in the project at this root; the settings page shows only those that do."""
        return True
