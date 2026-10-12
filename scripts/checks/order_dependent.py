"""Runs every test alone and compares it with how it came out in the whole run, which is how a test that depends on what ran before it shows itself.

A test that passes alone and fails in the run was broken by an earlier test; one that fails alone and passes in the run needs
an earlier test to set it up. The run is the suite in file order, so nothing else would ever tell them apart. Slow by design
(one process a test, one after another under the suite's lock): a nightly check, never a gate. Pass the junit file of a whole
run already made to skip making another: `order_dependent.py --whole run.xml`."""

import argparse
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).resolve().parents[2]
PYTHON = ROOT / ".venv" / "bin" / "python"
LOCK = "/private/tmp/aj-suite.lock"
PYTEST = ("-m", "pytest", "-q", "-p", "no:cacheprovider", "-o", "junit_family=xunit1")


@dataclass(frozen=True)
class Finding:
    test: str
    alone: bool
    cause: str

    def says(self) -> str:
        what = "passes alone and fails in the whole run" if self.alone else "fails alone and passes in the whole run"
        return f"{self.test} {what}; {self.cause}"


def outcomes(junit: Path) -> dict[str, bool]:
    """Each test of a junit file as `file::name`, true when it passed; a skipped test is left out, since it ran nothing."""
    found = {}
    for case in ET.parse(junit).getroot().iter("testcase"):
        if case.find("skipped") is not None:
            continue
        found[f"{case.get('file')}::{case.get('name')}"] = case.find("failure") is None and case.find("error") is None
    return found


def run(*arguments: str, junit: Path) -> dict[str, bool]:
    """One pytest process under the suite's lock, so it never starts beside another run of this project."""
    subprocess.run(["lockf", "-k", LOCK, str(PYTHON), *PYTEST, f"--junitxml={junit}", *arguments], cwd=ROOT, capture_output=True, text=True)
    return outcomes(junit)


def culprit(earlier: list[str], differs: Callable[[list[str]], bool]) -> list[str]:
    """The fewest earlier tests that still make the target come out differently, found by halving; empty when none of them do."""
    if not earlier or not differs(earlier):
        return []
    while len(earlier) > 1:
        half = len(earlier) // 2
        first, rest = earlier[:half], earlier[half:]
        if differs(first):
            earlier = first
        elif differs(rest):
            earlier = rest
        else:
            return earlier
    return earlier


def explained(alone: bool, found: list[str]) -> str:
    if not found:
        return "no earlier test on its own reproduces it, so it is the order of many or the machine"
    names = ", ".join(found)
    return f"it breaks after {names}" if alone else f"it needs {names} to have run before it"


def findings(whole: dict[str, bool], order: list[str], junit: Path) -> list[Finding]:
    found = []
    for position, test in enumerate(order):
        if test not in whole:
            continue
        alone = run(test, junit=junit).get(test)
        if alone is None or alone == whole[test]:
            continue

        def differs(earlier: list[str]) -> bool:
            return run(*earlier, test, junit=junit).get(test) != alone

        found.append(Finding(test, alone, explained(alone, culprit(order[:position], differs))))
    return found


def collected() -> list[str]:
    done = subprocess.run([str(PYTHON), "-m", "pytest", "--collect-only", "-q", "-p", "no:cacheprovider"], cwd=ROOT, capture_output=True, text=True)
    return [line for line in done.stdout.splitlines() if "::" in line]


def problems(whole_run: Path | None) -> list[str]:
    with tempfile.TemporaryDirectory() as folder:
        junit = Path(folder) / "run.xml"
        whole = outcomes(whole_run) if whole_run else run(junit=junit)
        return [one.says() for one in findings(whole, collected(), junit)]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--whole", type=Path, default=None, help="the junit file of a whole run already made")
    found = problems(parser.parse_args().whole)
    print("\n".join(found) if found else "every test comes out as it does alone, wherever it runs")
    sys.exit(1 if found else 0)
