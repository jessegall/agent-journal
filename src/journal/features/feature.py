from pathlib import Path
from typing import ClassVar

from journal.console.command import Command
from journal.engine.conduct import Conduct
from journal.engine.base_state import BaseState
from journal.events.listener import Listener
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.features.seed import Seed
from journal.features.support.service import Service
from journal.support.skill import Skill


class Feature[D]:
    """One switchable subject. It brings its states, its nudges, its state-free listeners and its commands; nothing else knows a feature exists. D is the class of the part it reads into the feature data an event carries."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    help: ClassVar[str] = ""
    fixed: ClassVar[bool] = False
    states: ClassVar[tuple[type[BaseState], ...]] = ()
    nudges: ClassVar[tuple[Nudge, ...]] = ()
    options: ClassVar[tuple[Option, ...]] = ()
    listeners: ClassVar[tuple[type[Listener], ...]] = ()
    data: ClassVar[tuple[type, ...]] = ()
    conduct: ClassVar[tuple[type[Conduct], ...]] = ()
    commands: ClassVar[tuple[type[Command], ...]] = ()
    seeds: ClassVar[tuple[type[Seed], ...]] = ()
    skill: ClassVar[Skill | None] = None
    services: ClassVar[tuple[Service, ...]] = ()
    default: ClassVar[bool] = True

    @classmethod
    def applies(cls, root: Path) -> bool:
        return True
