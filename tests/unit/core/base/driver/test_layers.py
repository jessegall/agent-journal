from collections.abc import Sequence
from datetime import datetime, timedelta, timezone

from core.base.container import Container
from core.base.driver.layers import Layers
from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.registry.dotted_path import DottedPath
from core.base.registry.overlay_entry import OverlayEntry
from core.base.timestamp import Timestamp
from tests.unit.core.base.sample_container import empty_registry

START = datetime(2026, 10, 31, 9, tzinfo=timezone.utc)


def at(minutes: int) -> Timestamp:
    return Timestamp(START + timedelta(minutes=minutes))


class SampleWaits(Overlay):
    """Two waits of the agent: the first made earlier but resumed later than the second."""

    name = "samples.wait"

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("wait", 1, at(30)), OpenRow("wait", 2, at(20))]


class SampleRuns(Overlay):
    """One sequence run of the agent, made between the two waits."""

    name = "samples.run"
    drivers = ["coding.*"]

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        return [OpenRow("sequence_run", 5, at(25))]


def layers() -> Layers:
    entries = (OverlayEntry("samples.wait", DottedPath.class_path(SampleWaits), 1, ("*",)), OverlayEntry("samples.run", DottedPath.class_path(SampleRuns), 2, ("coding.*",)))
    return Layers(empty_registry().with_overlays(entries), Container())


def test_layers_go_newest_activation_first_so_a_resumed_row_is_on_top_and_two_rows_of_one_overlay_are_two_layers():
    assert [layer.row.ref for layer in layers().active(7, "coding.builder")] == ["wait:1", "sequence_run:5", "wait:2"]


def test_an_overlay_whose_drivers_do_not_name_the_driver_adds_no_layer():
    assert [layer.row.ref for layer in layers().active(7, "marketing.lead")] == ["wait:1", "wait:2"]
