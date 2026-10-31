from argparse import Namespace
from dataclasses import dataclass

from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


@dataclass(frozen=True)
class TextReading:
    """A document or report with the reading flags it was asked for with."""

    text_row: Doc | Report
    arguments: Namespace
