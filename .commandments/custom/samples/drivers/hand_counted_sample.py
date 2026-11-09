class PollCheck:
    """A check that keeps its own count, which each new command line loses."""

    def __init__(self, countdowns: Countdowns) -> None:
        self.reads_seen = 0
        self.countdowns = countdowns

    def record(self) -> None:
        # @sin architecture_drivers_counter_kept_on_an_object
        self.reads_seen += 1

    def next_reads(self, previous_reads: int) -> int:
        # @sin architecture_drivers_count_raised_by_hand
        return previous_reads + 1

    def warning(self, limit: int) -> object:
        # @sin architecture_drivers_countdown_given_a_computed_number
        return SAMPLE_COUNTDOWN.nudge(limit - self.reads_seen)

    def countdown_line(self, actor_id: int, context: Context) -> object:
        remaining = self.countdowns.tick(SAMPLE_COUNTDOWN, actor_id, "output", context)
        # @righteous architecture_drivers_countdown_given_a_computed_number
        SAMPLE_COUNTDOWN.nudge("{left}")
        # @righteous architecture_drivers_count_raised_by_hand
        return remaining + 1
