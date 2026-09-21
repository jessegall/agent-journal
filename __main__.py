import runpy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
if len(sys.argv) > 2 and sys.argv[1] == "-m":
    module = sys.argv[2]
    sys.argv = [sys.argv[0], *sys.argv[3:]]
    runpy.run_module(module, run_name="__main__", alter_sys=True)
else:
    runpy.run_module("journal", run_name="__main__", alter_sys=True)
