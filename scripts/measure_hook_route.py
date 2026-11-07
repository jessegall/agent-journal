"""Times hooks through the drivers' hook route, in process on the machinery stories' sample suite with an open edit
lock and on the coding suite's builder with a task in hand, and through a running server's socket on the coding
suite, and prints the median, the 95th percentile and the worst per hook for each. Run with PYTHONPATH=src:.
python3 scripts/measure_hook_route.py; it is a measurement, never part of the test run."""
import statistics
import tempfile
import time
from pathlib import Path

from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases
from tests.stories.core.base.driver.support.fixtures import LeadLocked
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask
from tests.stories.server.support.server_client import request_answer, started_server

HOOKS = 200


SAMPLES_IN_TURN = (HookSamples.edit("src/cart.py"), HookSamples.stop(), HookSamples.prompt("go on"))


def opened(modules: tuple[str, ...], fixture: type[StoryFixture]) -> Story:
    folder = Path(tempfile.mkdtemp())
    return TemplateDatabases(folder / "templates").story(folder / "journal", modules, fixture)


def measured_in_process(modules: tuple[str, ...], fixture: type[StoryFixture]) -> list[float]:
    story = opened(modules, fixture)
    durations: list[float] = []
    for number in range(HOOKS):
        started = time.perf_counter()
        story.hook("s-1", SAMPLES_IN_TURN[number % len(SAMPLES_IN_TURN)])
        durations.append((time.perf_counter() - started) * 1000)
    story.close()
    return sorted(durations)


def measured_through_server(fixture: type[StoryFixture]) -> list[float]:
    story = opened((), fixture)
    story.close()
    durations: list[float] = []
    with started_server(story.home) as (socket, _):
        for number in range(HOOKS):
            body = SAMPLES_IN_TURN[number % len(SAMPLES_IN_TURN)].with_fields(session="s-1", environment="main", firing=f"measure-{number}").body
            started = time.perf_counter()
            request_answer(socket, "POST", "/hook", dict(body))
            durations.append((time.perf_counter() - started) * 1000)
    return sorted(durations)


def printed(title: str, durations: list[float]) -> None:
    print(f"{title}, {HOOKS} hooks: median {statistics.median(durations):.2f} ms, p95 {durations[int(len(durations) * 0.95)]:.2f} ms, worst {durations[-1]:.2f} ms")


if __name__ == "__main__":
    printed("sample suite in process", measured_in_process((SAMPLES,), LeadLocked))
    printed("coding suite in process", measured_in_process((), BuilderWithStartedTask))
    printed("coding suite through the server socket", measured_through_server(BuilderWithStartedTask))
