import json
import os
from pathlib import Path
from io import StringIO
from urllib.request import OpenerDirector, Request


def read_files(path: Path, filename: str):
    # @sin FileReadsDetector
    path.read_text()
    # @sin FileReadsDetector
    path.read_bytes()
    # @sin FileReadsDetector
    path.open()
    # @sin FileReadsDetector
    path.open("rb")
    # @sin FileReadsDetector
    open(filename)
    # @sin FileReadsDetector
    open(filename, "r")
    # @sin FileReadsDetector
    path.open(mode="r")
    # @sin FileReadsDetector
    json.load(path.open())
    # @sin FileReadsDetector
    json.load(path)
    # @righteous FileReadsDetector
    json.load(StringIO("{}"))


def write_files(path: Path, filename: str):
    # @sin FileWritesDetector
    path.write_text("notes")
    # @sin FileWritesDetector
    path.write_bytes(b"notes")
    # @sin FileWritesDetector
    path.touch()
    # @sin FileWritesDetector
    path.open("w")
    # @sin FileWritesDetector
    path.open(mode="a")
    # @sin FileWritesDetector
    open(filename, "wb")
    # @sin FileWritesDetector
    open(filename, mode="x")
    # @sin FileWritesDetector
    os.open(path, os.O_WRONLY | os.O_CREAT, 0o600)


def network_json(opener: OpenerDirector, request: Request):
    # @righteous FileReadsDetector
    with opener.open(request) as response:
        # @righteous FileReadsDetector
        return json.load(response)
