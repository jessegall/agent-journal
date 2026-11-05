from argparse import Namespace
from dataclasses import dataclass
from core.modules.documents.models.text_row import TextRow



@dataclass(frozen=True)
class TextReading:
    """A document or report with the reading flags it was asked for with."""

    text_row: TextRow
    arguments: Namespace
