from dataclasses import dataclass


@dataclass(frozen=True)
class ManifestInstructionBlock:
    """A block of text a plugin offers for the instruction files of a helper's profile: its key, the title of
    the profile switch for it, the plugin's file holding the text, and whether a profile has it on until
    told otherwise."""

    key: str
    title: str
    file: str
    default: bool = True
