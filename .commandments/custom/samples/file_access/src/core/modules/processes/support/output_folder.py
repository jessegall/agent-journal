from pathlib import Path


def process_output(path: Path):
    # @righteous FileReadsDetector
    path.open("rb")
    # @sin FileWritesDetector
    path.write_text("output")
