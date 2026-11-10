from pathlib import Path
import sys

import pytest


if __name__ == "__main__":
    stories = Path(__file__).with_suffix(".txt").read_text().splitlines()
    raise SystemExit(pytest.main(["-v", "--tb=short", *sys.argv[1:], *stories]))
