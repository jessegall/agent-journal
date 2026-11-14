from enum import StrEnum


class Stopped(StrEnum):
    """What a stop of an agent's program came to: the program has ended and so has its row, or the program
    runs on and its row is left open."""

    PROGRAM_ENDED = "program_ended"
    PROGRAM_RUNNING = "program_running"
