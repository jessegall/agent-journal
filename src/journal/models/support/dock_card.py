from dataclasses import dataclass

from journal.models.support.dock_button import DockButton


@dataclass(frozen=True)
class DockCard:
    """How a row's card above the chat is drawn: the buttons it carries and whether its body folds when the chat is short."""

    buttons: tuple[DockButton, ...]
    folds: bool = True

    @classmethod
    def plain(cls) -> "DockCard":
        return cls((DockButton("Open", "open"), DockButton("Close", "close")))

    def as_data(self) -> dict:
        return {"buttons": [{"label": button.label, "act": button.act} for button in self.buttons], "folds": self.folds}
