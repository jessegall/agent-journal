from engine.helper_type.helper_lines import HelperLines


class WorkersHelperLines(HelperLines):
    """The workers' lines a read-only helper may run: reading a worker's logs and the next merge."""

    lines = ("worker logs", "merger next")
