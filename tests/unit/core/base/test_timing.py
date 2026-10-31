import io
import json

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.command.bus import Bus
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.make_command import MakeCommand
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from core.base.timing import Timing
from tests.unit.core.base.command.test_bus import handlers
from tests.unit.core.base.command.test_commands import ItemMake
from tests.unit.core.base.module.test_module_sync import ITEMS
from tests.unit.core.base.sample_container import sample_container


def names(timing: Timing) -> list[str]:
    return [name for name, _ in timing.stamps]


def test_a_stamp_with_no_timing_set_does_nothing():
    timing = Timing()
    timing.stamp("command_started")
    assert timing.text() == ""


def test_a_started_timing_keeps_its_first_name_and_the_names_after_it():
    timing = Timing.started("server_accepted")
    timing.stamp("server_received")
    assert names(Timing.parsed("go_start=1;go_sent=2").joined(timing)) == ["go_start", "go_sent", "server_accepted", "server_received"]


def test_a_stamp_with_a_timing_set_adds_one_name_after_the_others():
    timing = Timing.parsed("go_start=1761904800015012;go_sent=1761904800015420")
    timing.stamp("server_received")
    assert names(timing) == ["go_start", "go_sent", "server_received"]


def test_a_header_with_a_malformed_pair_keeps_its_good_pairs():
    timing = Timing.parsed("go_start=1761904800015012;go_sent=soon;=1761904800015420;server_accepted;server_received=1761904800016000")
    assert timing.stamps == [("go_start", 1761904800015012), ("server_received", 1761904800016000)]


def test_a_request_id_pairs_the_senders_pid_with_its_go_start_and_is_empty_without_one():
    assert Timing.parsed("go_start=1761904800015012;go_sent=1761904800015420").request_id(4321) == "4321-1761904800015012"
    assert Timing.started("server_accepted").request_id(4321) == ""


@pytest.fixture
def container(tmp_path):
    return sample_container(tmp_path, Registry("abc", {}, handlers((MakeCommand, MakeHandler)), {}, (), []))


def test_a_write_with_a_timing_set_stamps_the_lock_then_the_commit(container):
    timing = Timing.started("server_received")
    container.bind(Timing, timing)
    container.get(Bus).run(ItemMake(title="Dune"), Actor(7, ActorType.AGENT))
    assert names(timing) == ["server_received", "write_started", "committed"]


def test_an_explained_write_stamps_nothing(container):
    timing = Timing.started("server_received")
    container.bind(Timing, timing)
    container.get(Bus).explain(ItemMake(title="Dune"), Actor(7, ActorType.AGENT))
    assert names(timing) == ["server_received"]


def test_a_line_run_stamps_the_command_start_before_its_write(tmp_path):
    home = JournalHome(tmp_path)
    home.module_list.write_text(json.dumps([ITEMS]))
    assert LineRun(home).run(["module", "sync"], CallerRequest(), io.StringIO()) == 0
    timing = Timing.started("server_received")
    assert LineRun(home).run(["item", "make", "Dune"], CallerRequest(), io.StringIO(), timing=timing) == 0
    assert names(timing) == ["server_received", "command_started", "write_started", "committed"]
