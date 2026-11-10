from pathlib import Path


def native_files(path: Path):
    # @righteous FileReadsDetector
    path.read_bytes()
    # @righteous FileReadsDetector
    path.open("rb")
    # @righteous FileWritesDetector
    path.write_text("notes")
    # @righteous FileWritesDetector
    path.write_bytes(b"notes")
    # @righteous FileWritesDetector
    path.touch()
    # @righteous FileWritesDetector
    path.open("a")
