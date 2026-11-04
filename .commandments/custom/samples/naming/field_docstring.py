from dataclasses import dataclass


@dataclass
class Basket:
    """A customer's goods before they pay."""

    # @sin naming_field_docstring
    total: int
    """What they pay."""

    # @righteous naming_field_docstring
    count: int
