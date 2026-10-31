"""Writes tools/journal-hook/programs/programs.json, the program table the Go hook program ships, from the agent
programs of the journal's default modules."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / "src")]

from core.base.provider.program_table import ProgramTable  # noqa: E402
from core.modules import DEFAULT_MODULES  # noqa: E402

SHIPPED_TABLE = ROOT / "tools" / "journal-hook" / "programs" / "programs.json"

if __name__ == "__main__":
    SHIPPED_TABLE.write_text(ProgramTable([provider for module in DEFAULT_MODULES for provider in module.providers]).text())
    print(f"wrote {SHIPPED_TABLE.relative_to(ROOT)}")
