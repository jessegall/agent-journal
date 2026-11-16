from collections.abc import Sequence
from typing import ClassVar


class HelperLines:
    """Journal lines of a module that every read-only helper may run beside core's own."""

    lines: ClassVar[Sequence[str]] = ()
