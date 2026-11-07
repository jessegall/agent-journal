from enum import StrEnum


class ApprovalDecision(StrEnum):
    ACCEPT = "accept"
    REFUSE = "refuse"

    def choose[T](self, accepted: T, refused: T) -> T:
        return accepted if self is self.ACCEPT else refused
