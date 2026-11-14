import sqlite3

import pytest

from engine.container.container import Container
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from server.work.journal_round import JournalRound
from server.work.kept_round_container import KeptRoundContainer
from server.work.round_work import RoundWork


class FailedRoundError(Exception):
    def __init__(self) -> None:
        super().__init__("the round failed")


class RecordedWork(RoundWork):
    def __init__(self, failing_rounds: int = 0) -> None:
        self.containers: list[Container] = []
        self.failing_rounds = failing_rounds

    def run(self, container: Container) -> None:
        self.containers.append(container)
        if len(self.containers) <= self.failing_rounds:
            raise FailedRoundError()


def test_two_rounds_use_one_kept_container(home):
    work = RecordedWork()
    journal_round = JournalRound(home, "listener thread", work, KeptRoundContainer(home))
    journal_round.run()
    journal_round.run()
    assert work.containers[0] is work.containers[1]
    journal_round.close()


def test_a_round_error_is_reported_and_the_container_survives(home):
    work = RecordedWork(failing_rounds=1)
    journal_round = JournalRound(home, "listener thread", work, KeptRoundContainer(home))
    with pytest.raises(FailedRoundError) as raised:
        journal_round.run()
    journal_round.report(raised.value)
    journal_round.run()
    assert work.containers[0] is work.containers[1]
    assert "the round failed" in home.system_log.read_text()
    journal_round.close()


def test_close_closes_the_connection(home):
    work = RecordedWork()
    journal_round = JournalRound(home, "listener thread", work, KeptRoundContainer(home))
    journal_round.run()
    journal_round.close()
    with pytest.raises(sqlite3.ProgrammingError):
        work.containers[0].get(Database).connection.execute("SELECT 1")
