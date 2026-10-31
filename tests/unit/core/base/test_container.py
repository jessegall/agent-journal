from dataclasses import dataclass
from pathlib import Path

import pytest

from core.base.container import Container, UnboundValueError
from core.base.journal_home import JournalHome


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
