from dataclasses import dataclass


@dataclass
class Basket:
    """A customer's goods before they pay."""

    # @sin naming_FieldDocstringDetector
    total: int
    """What they pay."""

    # @righteous naming_FieldDocstringDetector
    count: int
