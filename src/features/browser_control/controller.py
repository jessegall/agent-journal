import base64
import tempfile
import time
from pathlib import Path

import controllers.types as types_module
from controllers.base import Controller
from resources import types
from resources.base import Refused, names

UPLOAD = names("name", "data")
OPS = ("shot", "url", "text", "dom", "console", "click", "type", "goto", "eval", "scroll")


class Asks(Controller):
    resource = types.Ask

    def driving(self) -> dict:
        return self.record.state("browser_control").all()

    def _drive(self, on: bool, url: str = "", title: str = "") -> None:
        self.record.state("browser_control").update({"on": bool(on), "url": url, "title": title, "at": time.time()})

    def ask(self, op: str, *args: str, wait: int = 30):
        if op not in OPS:
            raise Refused(f"an ask is one of {' '.join(OPS)}")
        tab = self.driving()
        if not tab.get("on"):
            raise Refused("no tab is being driven: the user turns driving on in the chat window's bar (the wheel)")
        made = self.create(f"browser {op}", brief=" ".join(args), op=op, args=list(args))
        end = time.time() + int(wait)
        while time.time() < end:
            got = self.load(made.n)
            if got.completed:
                return got
            time.sleep(0.4)
        return self.load(made.n)

    def pending(self) -> list:
        return self._standing()

    def answer(self, n: int, text: str, ok: bool = True, files: tuple = ()):
        self.complete(n, text, ok=ok)
        for f in files:
            with tempfile.TemporaryDirectory() as folder:
                path = Path(folder) / Path(f[UPLOAD.name]).name
                path.write_bytes(base64.b64decode(f[UPLOAD.data].split(",", 1)[-1]))
                self.attach(n, str(path))
        return self.load(n)


types_module.register(Asks)
