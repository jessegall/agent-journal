#!/usr/bin/env python3
"""Newest first, on every list that pages.

    .journal/test_order.py

WHY THIS IS A SUITE OF ITS OWN. Four modules render four lists and each one sliced its own
page by hand, so "newest first" had to be four changes that could drift apart. They share
`fmt.paged` now, and this holds all four to the same three promises: the newest entry is on
page 1, the NUMBER travels with the row so `pin 3` is pin 3 either way, and `--order=asc`
gives back exactly the old reading.

Every test runs against a throwaway directory. It never touches the real record.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import docs as docs_mod, fmt, pins, tools as tools_mod, transcript  # noqa: E402
import todo as todo_mod  # noqa: E402

AT = "2026-09-01T12:00:00+00:00"
ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def fresh() -> Path:
    d = Path(tempfile.mkdtemp()) / "proj" / ".journal"
    d.mkdir(parents=True)
    return d


def first_line(text: str) -> str:
    for l in text.splitlines():
        if l.strip() and not l.startswith(("  …", "  No", "  Nothing")):
            return l.strip()
    return ""


# ---------------------------------------------------------------- the helper itself
check("desc reverses", fmt.ordered([1, 2, 3]), [3, 2, 1])
check("asc leaves it alone", fmt.ordered([1, 2, 3], fmt.ASC), [1, 2, 3])
check("the newest page comes first", fmt.paged(list(range(1, 8)), 3, 1), ([7, 6, 5], 4))
check("and the second page continues it", fmt.paged(list(range(1, 8)), 3, 2), ([4, 3, 2], 1))
check("asc pages from the oldest", fmt.paged(list(range(1, 8)), 3, 1, fmt.ASC), ([1, 2, 3], 4))
check("no cap, no cut", fmt.paged([1, 2], None), ([2, 1], 0))
check("the more-line carries a non-default order",
      fmt.more("pins", 4, 1, fmt.ASC), "\n\n  … and 4 more; `journal pins --page=2 --order=asc` shows the rest.")
check("and stays quiet when nothing was cut", fmt.more("pins", 0, 1), "")

# ---------------------------------------------------------------- pins and rules
r = fresh()
for i in range(1, 6):
    pins.add(r, f"claim {i}", AT, 200)
check("the newest pin is read first", first_line(pins.render(r)).split()[0], "5")
check("and its NUMBER is unchanged — the store is not reordered",
      first_line(pins.render(r)), "5  claim 5")
check("--order=asc is the old reading", first_line(pins.render(r, order=fmt.ASC)), "1  claim 1")
check("page 1 holds the newest, not the oldest",
      [n for n, _ in [(l.split()[0], l) for l in pins.render(r, cap=2).splitlines() if l.strip() and l[2:3].isdigit()]],
      ["5", "4"])
check("and the cut line offers the next page", "--page=2" in pins.render(r, cap=2), True)

# ---------------------------------------------------------------- to-dos
r2 = fresh()
for i in range(1, 5):
    todo_mod.add(r2, "default", f"to-do {i}", "brief", AT)
check("the newest to-do is read first", "to-do 4" in first_line(todo_mod.render(r2, "default")), True)
check("asc gives the oldest", "to-do 1" in first_line(todo_mod.render(r2, "default", order=fmt.ASC)), True)

# ---------------------------------------------------------------- docs
r3 = fresh()
for i in range(1, 4):
    docs_mod.add(r3, f"doc {i}", f"abstract {i}", "body", "default")
check("the newest doc is read first", "doc 3" in first_line(docs_mod.catalogue(r3)), True)
check("asc gives the oldest", "doc 1" in first_line(docs_mod.catalogue(r3, order=fmt.ASC)), True)

# ---------------------------------------------------------------- tools
r4 = fresh()
for i in range(1, 4):
    (r4.parent / f"t{i}.sh").write_text("#!/bin/sh\necho hi\n")
    tools_mod.add(r4, f"tool-{i}", f"tool {i}", "does a thing", "journal tools run tool", "",
                  str(r4.parent / f"t{i}.sh"), "", "default")
listed = tools_mod.catalogue(r4)
check("the newest tool is read first", listed.index("tool-3") < listed.index("tool-1"), True)
check("asc gives the oldest first",
      tools_mod.catalogue(r4, order=fmt.ASC).index("tool-1") < tools_mod.catalogue(r4, order=fmt.ASC).index("tool-3"), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
