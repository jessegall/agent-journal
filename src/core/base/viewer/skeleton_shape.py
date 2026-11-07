from enum import Enum


class SkeletonShape(Enum):
    """The parts a window's loading skeleton is built from: shimmering lines, circles and blocks, and the
    rows, stacks, borderless cards and grids that hold other parts."""

    LINE = "line"
    CIRCLE = "circle"
    BLOCK = "block"
    GROW = "grow"
    ROW = "row"
    STACK = "stack"
    CARD = "card"
    GRID = "grid"
