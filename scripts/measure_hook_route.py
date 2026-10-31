"""Times hooks through the drivers' hook route in process, on the machinery stories' sample suite with an open edit
lock and on the coding suite's builder with a task in hand, and prints the median, the 95th percentile and the
worst per hook for each. Run with PYTHONPATH=src:. python3
scripts/measure_hook_route.py; it is a measurement, never part of the test run."""
import statistics
import tempfile
import time
from pathlib import Path

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases
from tests.stories.core.base.drivers.support.fixtures import LeadLocked
from tests.stories.core.base.drivers.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask

HOOKS = 200


def measured(modules: tuple[str, ...], fixture: type[StoryFixture]) -> list[float]:
    folder = Path(tempfile.mkdtemp())
    story = TemplateDatabases(folder / "templates").story(folder / "journal", modules, fixture)
    samples = [HookSamples.edit("src/cart.py"), HookSamples.stop(), HookSamples.prompt("go on")]
    durations: list[float] = []
    for number in range(HOOKS):
        started = time.perf_counter()
        story.hook("s-1", samples[number % len(samples)])
        durations.append((time.perf_counter() - started) * 1000)
    story.close()
    return sorted(durations)


if __name__ == "__main__":
    for title, modules, fixture in (("sample suite", (SAMPLES,), LeadLocked), ("coding suite", (), BuilderWithStartedTask)):
        durations = measured(modules, fixture)
        print(f"{title}, {HOOKS} hooks: median {statistics.median(durations):.2f} ms, p95 {durations[int(len(durations) * 0.95)]:.2f} ms, worst {durations[-1]:.2f} ms")
