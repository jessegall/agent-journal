"""Where the running code and the data shipped beside it are, and the command that runs one of its modules: worked out from the place this file is in, reading nothing."""

import sys
from pathlib import Path

CODE = Path(__file__).resolve().parents[1]
ZIPPED = CODE.suffix == ".pyz"
DATA = CODE.with_name("src") if ZIPPED else CODE
SRC = "src"
ARCHIVE = "journal.pyz"


def data(*parts: str) -> Path:
    return DATA.joinpath(*parts)


def entry(module: str) -> list[str]:
    return [sys.executable, str(CODE.with_name(ARCHIVE) if ZIPPED else CODE), "-m", module]
