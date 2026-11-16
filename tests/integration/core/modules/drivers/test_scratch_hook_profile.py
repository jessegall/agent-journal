import traceback
from collections import Counter
from pathlib import Path

from engine.database.database import Database
from engine.database.point_tally import PointTally
from datetime import timedelta
from tests.integration.core.modules.drivers.test_hook_points import SAMPLES, filled_hook_points, busy_hook_points  # noqa: F401

REPORT = Path("/private/tmp/claude-501/-Users-jessegall-projects-agent-journal/4af7f2b8-3c6d-457d-bf46-cb98c0419054/scratchpad/hook_profile.txt")


def test_profile(busy_hook_points, monkeypatch):
    story, database = busy_hook_points
    story.advance(timedelta(seconds=35))
    sites: Counter[str] = Counter()
    writes: Counter[str] = Counter()
    sizes: Counter[str] = Counter()
    original_loaded, original_write = PointTally.loaded, PointTally.count_write

    def loaded(self, rows, statement):
        if rows:
            frames = [frame for frame in traceback.extract_stack()[:-1] if "/src/" in frame.filename and "/engine/database/" not in frame.filename and "/engine/query/" not in frame.filename and "/engine/repository/" not in frame.filename]
            site = " < ".join(f"{Path(frame.filename).stem}:{frame.lineno}" for frame in frames[-3:][::-1])
            sites[f"{statement.sql[:70]} @ {site}"] += len(rows)
            size = sum(len(value) for row in rows for value in row if isinstance(value, (str, bytes)))
            sizes[f"{statement.sql[:60]} @ {site}"] += size
        return original_loaded(self, rows, statement)

    def count_write(self, sql):
        frames = [frame for frame in traceback.extract_stack()[:-1] if "/src/" in frame.filename and "/engine/database/" not in frame.filename and "/engine/repository/" not in frame.filename]
        writes[f"{sql[:60]} @ " + " < ".join(f"{Path(frame.filename).stem}:{frame.lineno}" for frame in frames[-2:][::-1])] += 1
        return original_write(self, sql)

    monkeypatch.setattr(PointTally, "loaded", loaded)
    monkeypatch.setattr(PointTally, "count_write", count_write)
    lines = []
    for name, sample in [("post_tool_use", SAMPLES["post_tool_use"]), ("stop", SAMPLES["stop"])]:
        sites.clear(); writes.clear(); sizes.clear()
        start = database.repeated_work.points()
        story.hook("s-1", sample)
        cost = database.repeated_work.points().minus(start)
        lines.append(f"== {name}: {cost.total} ({cost.line()})")
        lines.extend(f"  {rows:3} {site}" for site, rows in [item for item in sites.most_common() if not item[0].startswith("SELECT count(")][:40])
        lines.extend(f"  W{count:2} {site}" for site, count in writes.most_common(15))
        lines.extend(f"  B{size:6} {site}" for site, size in sizes.most_common(8))
    REPORT.write_text("\n".join(lines) + "\n")
