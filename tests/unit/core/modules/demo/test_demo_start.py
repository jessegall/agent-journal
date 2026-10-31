import os
import re
import signal
import time

from core.base.seed.demo_link import DemoLink
from core.modules.demo.support.demo_scratch import DemoScratch


def test_a_demo_starts_with_a_server_and_a_login_link_on_a_port_of_its_own(tmp_path):
    scratch = DemoScratch(tmp_path)
    session = scratch.start()
    try:
        link = re.fullmatch(r"http://127\.0\.0\.1:(\d+)/\?key=(\S+)&environment=demo", session.link)
        assert link is not None and DemoLink.is_allowed(int(link[1]))
        assert scratch.ask("GET", "/health")["status"] == "ok"
    finally:
        os.kill(session.pid, signal.SIGTERM)
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline and scratch.home.socket("server").exists():
            time.sleep(0.1)
