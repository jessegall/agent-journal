"""Times hooks through the drivers' hook route in process, on the machinery stories' sample suite with an open edit
lock, and prints the median, the 95th percentile and the worst per hook. Run with PYTHONPATH=src:. python3
scripts/measure_hook_route.py; it is a measurement, never part of the test run."""
import statistics
import tempfile
import time
from pathlib import Path

from core.testing.hook_samples import HookSamples
from core.testing.template_databases import TemplateDatabases
from tests.stories.core.base.drivers.support.fixtures import LeadLocked
from tests.stories.core.base.drivers.support.samples import SAMPLES

HOOKS = 200


def measured() -> list[float]:
    folder = Path(tempfile.mkdtemp())
    story = TemplateDatabases(folder / "templates").story(folder / "journal", (SAMPLES,), LeadLocked)
    samples = [HookSamples.edit("src/cart.py"), HookSamples.stop(), HookSamples.prompt("go on")]
    durations: list[float] = []
    for number in range(HOOKS):
        started = time.perf_counter()
        story.hook("s-1", samples[number % len(samples)])
        durations.append((time.perf_counter() - started) * 1000)
    story.close()
    return sorted(durations)


if __name__ == "__main__":
    durations = measured()
    print(f"{HOOKS} hooks: median {statistics.median(durations):.2f} ms, p95 {durations[int(len(durations) * 0.95)]:.2f} ms, worst {durations[-1]:.2f} ms")
