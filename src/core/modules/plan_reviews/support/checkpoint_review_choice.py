from dataclasses import dataclass


@dataclass(frozen=True)
class CheckpointReviewChoice:
    """The program and the model a checkpoint review runs on."""

    program: str
    model: str
