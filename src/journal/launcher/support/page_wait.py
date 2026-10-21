import json
import threading
from typing import Callable
import time
import urllib.request
import webbrowser
from pathlib import Path

from journal.support.supervisor_socket import SupervisorSocket

PATIENCE = 600.0
TAB_WAIT = 8.0


class PageWait:
    """The launch's watch for the journal's page: the first time the port in the port file answers, the band shows its address and the viewer opens in the browser; a port file a dead journal left answers nothing."""

    def __init__(self, port_file: Path, socket: str, band: tuple[str, str], viewer: str, log: Callable[[str], None]) -> None:
        self.port_file, self.socket, self.band, self.viewer, self.log = port_file, socket, band, viewer, log

    def start(self) -> None:
        threading.Thread(target=self.wait, daemon=True).start()

    def wait(self) -> None:
        began = time.time()
        while time.time() - began < PATIENCE:
            url = self.answering()
            if url:
                self.shown(url)
                return
            time.sleep(0.5)
        self.log(f"viewer: the journal's page did not answer within {int(PATIENCE)} seconds, so no tab was opened")

    def answering(self) -> str:
        url = f"http://127.0.0.1:{self.port_file.read_text().strip()}/" if self.port_file.is_file() else ""
        if not url:
            return ""
        try:
            with urllib.request.urlopen(url, timeout=0.5) as reply:
                return url if reply.status == 200 else ""
        except OSError:
            return ""

    def shown(self, url: str) -> None:
        try:
            SupervisorSocket.ask(self.socket, {"verb": "band", "left": self.band[0], "middle": self.band[1], "right": url})
        except OSError:
            pass
        if not self.viewer:
            return
        if self.tab_open(url):
            self.log(f"viewer: a tab of {url} is open already, so none was opened")
            return
        opened = webbrowser.open(url + self.viewer, new=2)
        self.log(f"viewer: opened {url + self.viewer}" if opened else f"viewer: the browser would not open {url + self.viewer}")

    def tab_open(self, url: str) -> bool:
        began = time.time()
        while time.time() - began < TAB_WAIT:
            try:
                with urllib.request.urlopen(url + "journal/viewer", timeout=0.5) as reply:
                    if json.loads(reply.read()).get("open"):
                        return True
            except (OSError, ValueError):
                return False
            time.sleep(0.5)
        return False
