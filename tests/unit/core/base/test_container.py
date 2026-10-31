from dataclasses import dataclass
from pathlib import Path

import pytest

from core.base.container import Container
from core.base.journal_home import JournalHome
from core.base.missing_hint_error import MissingHintError
from core.base.unbound_value_error import UnboundValueError
from core.base.wrong_instance_error import WrongInstanceError


@dataclass(frozen=True)
class Folder:
    """A sample class that asks for a path."""

    path: Path


def test_a_path_nobody_bound_is_refused_rather_than_made_up_as_the_working_folder():
    with pytest.raises(UnboundValueError):
        Container().get(Folder)


def test_a_bound_journal_home_is_handed_out_as_bound(tmp_path):
    container = Container()
    container.bind(JournalHome, JournalHome(tmp_path))
    assert container.get(JournalHome).error_log == tmp_path / "runtime" / "errors.log"


class Clockwork:
    pass


class Tower:
    def __init__(self, clockwork: Clockwork, floors: int = 3) -> None:
        self.clockwork, self.floors = clockwork, floors


class Bell:
    def __init__(self, tower: Tower) -> None:
        self.tower = tower


class UntypedParameter:
    def __init__(self, value) -> None:
        self.value = value


def test_each_class_is_built_once_with_what_its_constructor_asks_for():
    container = Container()
    bell = container.get(Bell)
    assert bell.tower is container.get(Tower)
    assert bell.tower.clockwork is container.get(Clockwork)


def test_a_parameter_with_a_default_is_left_to_its_default():
    assert Container().get(Tower).floors == 3


def test_a_bound_value_is_given_instead_of_built():
    container = Container()
    clockwork = Clockwork()
    container.bind(Clockwork, clockwork)
    assert container.get(Tower).clockwork is clockwork


def test_the_container_gives_itself():
    container = Container()
    assert container.get(Container) is container


def test_a_parameter_without_a_type_is_a_clear_fault():
    with pytest.raises(MissingHintError, match="value"):
        Container().get(UntypedParameter)


def test_a_value_bound_for_a_class_must_be_one_of_it():
    container = Container()
    container.instances[Clockwork] = "not a clockwork"
    with pytest.raises(WrongInstanceError, match="Clockwork"):
        container.get(Clockwork)
