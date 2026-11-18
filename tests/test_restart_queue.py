import os
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from journal.console.commands.setup_command import RESTART_FAILED, SetupCommand
from journal.engine.lifecycle import Lifecycle
from journal.features.shell.support.restart_queue import RestartQueue
from journal.features.shell.support.unsupervised_journal import UnsupervisedJournal
from journal.support.supervisor_reply import SupervisorReply


class Outputs:
    def active_outputs(self, environment_id: int, asking_folder: str) -> list:
        return []


class Supervisor:
    def __init__(self, reply: SupervisorReply) -> None:
        self.reply, self.asked = reply, []

    def restart_journal(self, environment_id: int) -> SupervisorReply:
        self.asked.append(environment_id)
        return self.reply


def queue(home: Path, reply: SupervisorReply) -> RestartQueue:
    config = SimpleNamespace(home=home)
    return RestartQueue(Outputs(), Supervisor(reply), config, Lifecycle(config))


class RestartQueueTest(unittest.TestCase):
    """A serve launched with no journal service, as the pod of task 3982 was, has its restart refused by the supervisor; setup restart then says so and names the server process, instead of saying it runs the new code."""

    def setUp(self) -> None:
        self.home = Path(tempfile.mkdtemp())

    def test_a_refused_restart_raises_naming_the_server_process(self) -> None:
        restarts = queue(self.home, SupervisorReply(False, "no process is named 'journal'"))

        with self.assertRaises(UnsupervisedJournal) as refused:
            restarts.restart(1, "")

        self.assertIn(f"process {os.getpid()}", str(refused.exception))
        self.assertIn("no process is named 'journal'", str(refused.exception))
        self.assertFalse(restarts.lifecycle.marker().exists())

    def test_an_accepted_restart_leaves_the_restart_marker(self) -> None:
        restarts = queue(self.home, SupervisorReply(True))

        self.assertEqual([], restarts.restart(1, ""))
        self.assertEqual(f"restart {os.getpid()}", restarts.lifecycle.marker().read_text())

    def test_setup_restart_fails_loudly_on_a_refusal(self) -> None:
        command = SetupCommand.__new__(SetupCommand)
        command.queue = queue(self.home, SupervisorReply(False, "no process is named 'journal'"))

        line = command.restarting(SimpleNamespace(name="main", row_id=1), "")

        self.assertTrue(line.startswith(RESTART_FAILED))
        self.assertIn(f"process {os.getpid()}", line)
        self.assertNotIn("runs the new code", line)

    def test_setup_restart_reports_the_new_code_once_accepted(self) -> None:
        command = SetupCommand.__new__(SetupCommand)
        command.queue = queue(self.home, SupervisorReply(True))

        self.assertIn("runs the new code", command.restarting(SimpleNamespace(name="main", row_id=1), ""))
