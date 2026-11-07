from dataclasses import dataclass


@dataclass(frozen=True)
class ReaderJudgement:
    """The fields a reader lacks and the results it missed on kept output."""

    missing: tuple[str, ...] = ()
    missed: tuple[str, ...] = ()
    output_id: int | None = None

    @property
    def is_valid(self) -> bool:
        return not self.missing and not self.missed

    @property
    def text(self) -> str:
        return ", ".join((*self.missing, *self.missed))
