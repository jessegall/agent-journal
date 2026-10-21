class InfinitePoint(ArithmeticError):
    """A product on the curve came out as the point at infinity, which has no coordinates to use as a key or a signature."""

    def __init__(self) -> None:
        super().__init__("the product is the point at infinity")
