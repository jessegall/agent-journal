import re
from collections import Counter
from collections.abc import Sequence
from pathlib import Path

from engine.file.file_access import FileAccess

ALLOW_LIST_FILE = Path(__file__).with_name("layer_allow_list.txt")
IMPORT_LINE = re.compile(r".+ imports (?P<target>.+), which (?P<importer>.+) may not use$")


class LayerAllowList:
    """The layer violations that exist today, one line each; the layer test fails on any other."""

    @staticmethod
    def lines() -> list[str]:
        return [line for line in FileAccess.shared().read(ALLOW_LIST_FILE).splitlines() if line]

    @staticmethod
    def group_lines(lines: Sequence[str]) -> list[str]:
        matches = [match for line in lines if (match := IMPORT_LINE.match(line)) is not None]
        counts = Counter((match["importer"], match["target"]) for match in matches)
        return [f"{count}  {importer} imports {target}" for (importer, target), count in counts.most_common()]
