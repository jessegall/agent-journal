from enum import StrEnum


class CommandEffect(StrEnum):
    """What a shell command does to files, the network, version control or the session, as the command
    table names it."""

    READS_FILES = "reads_files"
    PRINTS_FILES = "prints_files"
    WRITES_FILES = "writes_files"
    MAKES_FILES = "makes_files"
    DELETES_FILES = "deletes_files"
    REACHES_NETWORK = "reaches_network"
    WRITES_NETWORK = "writes_network"
    CHANGES_VERSION_CONTROL = "changes_version_control"
    RUNS_LONG = "runs_long"
    CHANGES_FOLDER = "changes_folder"
