from dataclasses import dataclass


@dataclass(frozen=True)
class ManifestReading:
    """What one manifest in a folder of the project says: its language, the test tool and the command that runs its
    tests, or no command when it names none."""

    place: str
    language: str
    tool: str
    command: str | None
    file_name: str
