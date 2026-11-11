from engine.time.timestamp import Timestamp


class EscalationResets:
    """The resets of a command's count that later phases record: a mark that its output cannot be read, and a
    skip with a reason. Neither is recorded yet, so neither has happened."""

    def marked_since(self, command_key: str, timestamp: Timestamp) -> bool:
        return False

    def skipped_since(self, command_key: str, timestamp: Timestamp) -> bool:
        return False
