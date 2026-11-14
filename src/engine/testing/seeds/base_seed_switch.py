import os

BASE_SEED_VARIABLE = "JOURNAL_STORY_BASE_SEED"
SEEDED_FOLDER_SUFFIX = "-seeded"


class BaseSeedSwitch:
    """Whether the stories of this run start on top of the base seed: on when the variable is set to 1. A seeded
    run keeps its template databases in a folder of its own, so the two kinds never share one."""

    @staticmethod
    def is_enabled() -> bool:
        return os.environ.get(BASE_SEED_VARIABLE) == "1"

    @classmethod
    def folder_suffix(cls) -> str:
        return SEEDED_FOLDER_SUFFIX if cls.is_enabled() else ""
