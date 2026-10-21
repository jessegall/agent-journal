from abc import ABC, abstractmethod


class Suggester(ABC):
    """One thing the journal may suggest to the user: whether it applies to this project now, and the words and the place an accepted suggestion takes them to."""

    key: str
    accept_label: str

    @abstractmethod
    def applies(self) -> bool:
        pass

    @abstractmethod
    def title(self) -> str:
        ...

    @abstractmethod
    def detail(self) -> str:
        ...

    @abstractmethod
    def goes_to(self) -> str:
        pass
