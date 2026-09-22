from controllers.base import Controller
from resources import types
from resources.base import Refused
from engine.proc import ran


class Tools(Controller):
    resource = types.Tool

    def run(self, n: int, *args: str):
        tool = self.load(n)
        project = self.record.root.parent
        done = ran([*tool.entry.split(), *args], project, timeout=600)
        if done is None:
            raise Refused(f"tool {n} could not run: {tool.entry}")
        return {"code": done.returncode, "out": done.stdout, "err": done.stderr}
