from pathlib import Path
from typing import ClassVar

from journal.chat.process_card import ProcessCard
from journal.console.command import Command
from journal.engine.conduct import Conduct
from journal.engine.base_state import BaseState
from journal.engine.job import Job
from journal.engine.support.modes import Modes
from journal.events.data_source import DataSource
from journal.events.listener import Listener
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.features.seed import Seed
from journal.features.support.service import Service
from journal.support.skill import Skill


class Feature[D](DataSource[D]):
    """One switchable subject. It brings its states, its work modes if it has them, its nudges, its state-free listeners, its jobs, its live chat marks and its commands; nothing else knows a feature exists. D is the class of the part it reads into the feature data an event carries."""

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
    worker_conduct: ClassVar[tuple[type[Conduct], ...]] = ()
    commands: ClassVar[tuple[type[Command], ...]] = ()
    seeds: ClassVar[tuple[type[Seed], ...]] = ()
    jobs: ClassVar[tuple[type[Job], ...]] = ()
    process_cards: ClassVar[tuple[type[ProcessCard], ...]] = ()
    skill: ClassVar[Skill | None] = None
    services: ClassVar[tuple[Service, ...]] = ()
    default: ClassVar[bool] = True
    modes: ClassVar[Modes | None] = None

    @classmethod
    def applies(cls, root: Path) -> bool:
        return True
