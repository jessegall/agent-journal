import io
import json

import pytest

from core.base.actor import Actor, ActorType
from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.command.bus import Bus
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.make_command import MakeCommand
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from core.base.trail import Trail
from tests.unit.core.base.command.test_bus import handlers
from tests.unit.core.base.command.test_commands import ItemMake
from tests.unit.core.base.module.test_module_sync import ITEMS
from tests.unit.core.base.sample_container import sample_container


def names(trail: Trail) -> list[str]:
    return [name for name, _ in trail.stamps]


def test_a_stamp_with_no_trail_set_does_nothing():
    trail = Trail()
    trail.stamp("command_started")
    assert trail.text() == ""


def test_a_stamp_with_a_trail_set_adds_one_name_after_the_others():
    trail = Trail.parsed("go_start=1761904800015012;go_sent=1761904800015420")
    trail.stamp("server_received")
    assert names(trail) == ["go_start", "go_sent", "server_received"]


def test_a_header_with_a_malformed_pair_keeps_its_good_pairs():
    trail = Trail.parsed("go_start=1761904800015012;go_sent=soon;=1761904800015420;server_accepted;server_received=1761904800016000")
    assert trail.stamps == [("go_start", 1761904800015012), ("server_received", 1761904800016000)]


@pytest.fixture
def container(tmp_path):
    return sample_container(tmp_path, Registry("abc", {}, handlers((MakeCommand, MakeHandler)), {}, (), []))


def test_a_write_with_a_trail_set_stamps_the_lock_then_the_commit(container):
    trail = Trail.parsed("")
    container.bind(Trail, trail)
    container.get(Bus).run(ItemMake(title="Dune"), Actor(7, ActorType.AGENT))
    assert names(trail) == ["write_started", "committed"]


def test_a_line_run_stamps_the_command_start_before_its_write(tmp_path):
    home = JournalHome(tmp_path)
    home.module_list.write_text(json.dumps([ITEMS]))
    assert LineRun(home).run(["module", "sync"], CallerRequest(), io.StringIO()) == 0
    trail = Trail.parsed("")
    assert LineRun(home).run(["item", "make", "Dune"], CallerRequest(), io.StringIO(), trail=trail) == 0
    assert names(trail) == ["command_started", "write_started", "committed"]
