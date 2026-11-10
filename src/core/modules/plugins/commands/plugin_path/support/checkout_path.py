from dataclasses import dataclass
from engine.checkout.checkout import Checkout


@dataclass(frozen=True)
class CheckoutPath:
    """An absolute path as a plugin matches it: its name relative to the checkout that holds it, and that checkout."""

    relative: str
    checkout: Checkout

    def values(self) -> dict[str, object]:
        return {"relative": self.relative, "checkout": self.checkout.values()}
