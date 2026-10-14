import runpy

import commands.cli  # noqa: F401

runpy.run_module("runner.worker", run_name="__main__", alter_sys=True)
