from dataclasses import dataclass

from journal.models.phone import Phone


@dataclass(frozen=True)
class PairedPhone:
    """A phone just paired, with the key it keeps: the key is given once and only its hash is stored."""

    phone: Phone
    key: str
