# Needs Docker and the network to pull the base images: builds the team server image and runs it; not in the default run.
import json
import ssl
import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE = "agent-journal-team:test"
NAME = "agent-journal-team-image-test"
VOLUME = "agent-journal-team-image-test"
PORT = 8443
PASSWORD = "correct horse battery"


def docker(*arguments: str, seconds: int = 120) -> str:
    return subprocess.run(["docker", *arguments], capture_output=True, text=True, check=True, timeout=seconds).stdout.strip()


def login(device_name: str) -> dict:
    request = urllib.request.Request(f"https://localhost:{PORT}/login", data=json.dumps({"email": "ada@example.com", "password": PASSWORD, "device_name": device_name}).encode())
    unverified = ssl.create_default_context()
    unverified.check_hostname, unverified.verify_mode = False, ssl.CERT_NONE
    deadline = time.monotonic() + 20
    while True:
        try:
            with urllib.request.urlopen(request, timeout=10, context=unverified) as answer:
                return json.loads(answer.read())
        except OSError:
            if time.monotonic() > deadline:
                raise
            time.sleep(0.5)


def test_the_image_answers_a_login_over_https_and_keeps_its_data_across_a_restart():
    docker("build", "-q", "-f", "docker/team-server/Dockerfile", "-t", IMAGE, str(ROOT), seconds=600)
    docker("volume", "create", VOLUME)
    try:
        docker("run", "-d", "--name", NAME, "-e", "TEAM_ADDRESS=localhost", "-p", f"{PORT}:443", "-v", f"{VOLUME}:/data", IMAGE)
        time.sleep(2)
        docker("exec", NAME, "python", "-c", f"from pathlib import Path; from sync_server.account import ADMIN; from sync_server.team_server import TeamServer; TeamServer(Path('/data/team')).accounts.create('ada@example.com', 'Ada', '{PASSWORD}', ADMIN, 1.0)")
        assert login("first")["name"] == "Ada"
        docker("restart", NAME)
        assert login("after the restart")["device_id"] == 2, "the account and the first device are still there"
    finally:
        subprocess.run(["docker", "rm", "-f", NAME], capture_output=True, timeout=60)
        subprocess.run(["docker", "volume", "rm", VOLUME], capture_output=True, timeout=60)
