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


class Motor:
    pass


class Pump:
    def __init__(self, motor: Motor, litres_per_minute: int = 3) -> None:
        self.motor, self.litres_per_minute = motor, litres_per_minute


class Fountain:
    def __init__(self, pump: Pump) -> None:
        self.pump = pump


class UntypedParameter:
    def __init__(self, value) -> None:
        self.value = value


def test_each_class_is_built_once_with_what_its_constructor_asks_for():
    container = Container()
    bell = container.get(Fountain)
    assert bell.pump is container.get(Pump)
    assert bell.pump.motor is container.get(Motor)


def test_a_parameter_with_a_default_is_left_to_its_default():
    assert Container().get(Pump).litres_per_minute == 3


def test_a_bound_value_is_given_instead_of_built():
    container = Container()
    motor = Motor()
    container.bind(Motor, motor)
    assert container.get(Pump).motor is motor


def test_the_container_gives_itself():
    container = Container()
    assert container.get(Container) is container


def test_a_parameter_without_a_type_is_a_clear_fault():
    with pytest.raises(MissingHintError, match="value"):
        Container().get(UntypedParameter)


def test_a_value_bound_for_a_class_must_be_one_of_it():
    container = Container()
    container.instances[Motor] = "not a motor"
    with pytest.raises(WrongInstanceError, match="Motor"):
        container.get(Motor)
