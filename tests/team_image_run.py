# Needs Docker and the network to pull the base images: builds the team server image and runs it; not in the default run.
import json
import ssl
import subprocess
import time
import urllib.request
from pathlib import Path

from sync_server.protocol import PROTOCOL, PROTOCOL_HEADER

ROOT = Path(__file__).resolve().parent.parent
IMAGE = "agent-journal-team:test"
NAME = "agent-journal-team-image-test"
VOLUME = "agent-journal-team-image-test"
PORT = 8443
SPOKEN = {PROTOCOL_HEADER: str(PROTOCOL)}
PASSWORD = "correct horse battery"


def docker(*arguments: str, seconds: int = 120) -> str:
    return subprocess.run(["docker", *arguments], capture_output=True, text=True, check=True, timeout=seconds).stdout.strip()


def login(device_name: str) -> dict:
    request = urllib.request.Request(f"https://localhost:{PORT}/login", data=json.dumps({"email": "ada@example.com", "password": PASSWORD, "device_name": device_name}).encode(), headers=SPOKEN)
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


def test_the_host_setup_starts_a_server_on_a_fresh_volume_whose_admin_logs_in_and_whose_code_joins():
    import hashlib
    import re

    docker("build", "-q", "-f", "docker/team-server/Dockerfile", "-t", IMAGE, str(ROOT), seconds=600)
    environment = {"PATH": "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin", "HOME": str(Path.home()), "TEAM_IMAGE": IMAGE, "TEAM_SETUP_STDIN": "1", "TEAM_HTTPS_PORT": str(PORT), "TEAM_HTTP_PORT": "8480"}
    answers = "\n".join(["Setup Test", "Ada", "ada@example.com", PASSWORD, PASSWORD, "127.0.0.1"]) + "\n"
    try:
        setup = subprocess.run(["sh", str(ROOT / "host" / "install.sh")], input=answers, capture_output=True, text=True, env=environment, timeout=300)
        assert setup.returncode == 0, setup.stderr
        line = re.search(r"journal team join (\S+) --code (\S+) --fingerprint (\S+)", setup.stdout)
        assert line and line.group(1) == f"https://127.0.0.1:{PORT}", setup.stdout
        unverified = ssl.create_default_context()
        unverified.check_hostname, unverified.verify_mode = False, ssl.CERT_NONE
        with urllib.request.urlopen(f"{line.group(1)}/root.crt", timeout=10, context=unverified) as answer:
            assert hashlib.sha256(ssl.PEM_cert_to_DER_cert(answer.read().decode())).hexdigest() == line.group(3), "the fingerprint is the authority the server serves"
        accept = urllib.request.Request(f"{line.group(1)}/accept", data=json.dumps({"code": line.group(2), "name": "Ada", "password": PASSWORD, "password_repeat": PASSWORD, "device_name": "laptop"}).encode(), headers=SPOKEN)
        with urllib.request.urlopen(accept, timeout=10, context=unverified) as answer:
            assert json.loads(answer.read())["account_id"] == 1, "the admin's code logs the admin's journal in"
        again = subprocess.run(["sh", str(ROOT / "host" / "install.sh")], input=answers, capture_output=True, text=True, env=environment, timeout=120)
        assert again.returncode == 1 and "set up here already" in again.stderr
    finally:
        subprocess.run(["docker", "rm", "-f", "agent-journal-setup-test"], capture_output=True, timeout=60)
        subprocess.run(["docker", "volume", "rm", "agent-journal-setup-test"], capture_output=True, timeout=60)


def test_a_running_servers_backup_restores_into_a_new_container_that_answers_the_same_rows(tmp_path):
    docker("build", "-q", "-f", "docker/team-server/Dockerfile", "-t", IMAGE, str(ROOT), seconds=600)
    restored = "agent-journal-team-restored-test"
    docker("volume", "create", VOLUME)
    docker("volume", "create", restored)
    tmp_path.chmod(0o777)
    try:
        docker("run", "-d", "--name", NAME, "-e", "TEAM_ADDRESS=localhost", "-p", f"{PORT}:443", "-v", f"{VOLUME}:/data", IMAGE)
        time.sleep(2)
        docker("exec", NAME, "python", "-c", f"from pathlib import Path; from sync_server.account import ADMIN; from sync_server.team_server import TeamServer; TeamServer(Path('/data/team')).accounts.create('ada@example.com', 'Ada', '{PASSWORD}', ADMIN, 1.0)")
        token = login("before the backup")["token"]
        upload = urllib.request.Request(f"https://localhost:{PORT}/upload", data=json.dumps({"rows": [{"row_table": "tasks", "row": 7, "fields": {"title": "kept"}, "changed_at": {"title": 1.0}}], "highest": {"tasks": 7}, "repository": "", "version": "4.20.0", "migration": 0}).encode(), headers={**SPOKEN, "Authorization": f"Bearer {token}"})
        unverified = ssl.create_default_context()
        unverified.check_hostname, unverified.verify_mode = False, ssl.CERT_NONE
        urllib.request.urlopen(upload, timeout=10, context=unverified).read()
        copy = docker("exec", NAME, "python", "-m", "sync_server", "backup", "--data", "/data/team")
        docker("cp", f"{NAME}:{copy}", str(tmp_path / "team.db"))
        docker("rm", "-f", NAME)
        docker("run", "--rm", "-v", f"{restored}:/data", "-v", f"{tmp_path}:/backup", IMAGE, "python", "-m", "sync_server", "restore", "--data", "/data/team", "--from", "/backup/team.db")
        docker("run", "-d", "--name", NAME, "-e", "TEAM_ADDRESS=localhost", "-p", f"{PORT}:443", "-v", f"{restored}:/data", IMAGE)
        token = login("after the restore")["token"]
        request = urllib.request.Request(f"https://localhost:{PORT}/copy", headers={**SPOKEN, "Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(request, timeout=10, context=unverified) as answer:
            assert [row["fields"] for row in json.loads(answer.read())["rows"]] == [{"title": "kept"}], "the restored server answers the same rows"
    finally:
        subprocess.run(["docker", "rm", "-f", NAME], capture_output=True, timeout=60)
        subprocess.run(["docker", "volume", "rm", VOLUME, restored], capture_output=True, timeout=60)


def test_the_hosted_address_signs_a_person_in_and_shows_the_teams_tasks():
    import http.cookiejar
    import re

    from sync_server.protocol import MIGRATION_HEADER, VERSION_HEADER

    version = re.search(r'VERSION = "(.*)"', (ROOT / "src" / "journal" / "version.py").read_text()).group(1)
    migration = max(int(re.search(r"number: ClassVar\[int\] = (\d+)", path.read_text()).group(1)) for path in (ROOT / "src" / "journal" / "db" / "migrations").glob("*.py") if "number: ClassVar" in path.read_text())
    print("building the team image", flush=True)
    docker("build", "-q", "-f", "docker/team-server/Dockerfile", "-t", IMAGE, str(ROOT), seconds=600)
    subprocess.run(["docker", "rm", "-f", NAME], capture_output=True, timeout=60)
    subprocess.run(["docker", "volume", "rm", VOLUME], capture_output=True, timeout=60)
    docker("volume", "create", VOLUME)
    unverified = ssl.create_default_context()
    unverified.check_hostname, unverified.verify_mode = False, ssl.CERT_NONE
    try:
        print("starting the team server", flush=True)
        docker("run", "-d", "--name", NAME, "-e", "TEAM_ADDRESS=localhost", "-p", f"{PORT}:443", "-v", f"{VOLUME}:/data", IMAGE)
        time.sleep(2)
        docker("exec", NAME, "python", "-c", f"from pathlib import Path; from sync_server.account import ADMIN; from sync_server.team_server import TeamServer; TeamServer(Path('/data/team')).accounts.create('ada@example.com', 'Ada', '{PASSWORD}', ADMIN, 1.0)")
        token = login("a member's journal")["token"]
        stamped = {"created_at": "2026-10-23T08:00:00+00:00", "updated_at": "2026-10-23T08:00:00+00:00"}
        rows = [{"row_table": "environments", "row": 1, "fields": {"name": "main", **stamped}, "changed_at": {"name": 1.0}}, {"row_table": "tasks", "row": 7, "fields": {"title": "pushed by a member", "environment_id": 1, **stamped}, "changed_at": {"title": 1.0, "environment_id": 1.0}}]
        upload = urllib.request.Request(f"https://localhost:{PORT}/upload", data=json.dumps({"rows": rows, "highest": {"environments": 1, "tasks": 7}, "repository": "abc", "version": version, "migration": migration}).encode(), headers={**SPOKEN, MIGRATION_HEADER: str(migration), VERSION_HEADER: version, "Authorization": f"Bearer {token}"})
        urllib.request.urlopen(upload, timeout=10, context=unverified).read()
        jar = http.cookiejar.CookieJar()
        browser = urllib.request.build_opener(urllib.request.HTTPSHandler(context=unverified), urllib.request.HTTPCookieProcessor(jar))
        boundary = "journalform"
        form = "".join(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n" for name, value in (("email", "ada@example.com"), ("password", PASSWORD))).encode() + f"--{boundary}--\r\n".encode()
        print("waiting for the hosted journal to join and serve", flush=True)
        deadline = time.monotonic() + 180
        while True:
            try:
                browser.open(urllib.request.Request(f"https://localhost:{PORT}/sign-in", data=form, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}), timeout=10).read()
                break
            except OSError:
                if time.monotonic() > deadline:
                    raise
                time.sleep(2)
        people = json.loads(browser.open(urllib.request.Request(f"https://localhost:{PORT}/journal/people", headers={"X-Journal-Env": "main"}), timeout=10).read())
        assert people["me"] == 1, "the hosted address signs Ada in as Ada"
        tasks = browser.open(urllib.request.Request(f"https://localhost:{PORT}/journal/tasks", headers={"X-Journal-Env": "main"}), timeout=10).read().decode()
        assert "pushed by a member" in tasks, "and shows the task a member pushed"
        assert urllib.request.urlopen(urllib.request.Request(f"https://localhost:{PORT}/team", headers=SPOKEN), timeout=10, context=unverified).status == 200, "while the team server's own paths still reach it"
    except AssertionError:
        print("\n".join(line for line in subprocess.run(["docker", "logs", NAME], capture_output=True, text=True, timeout=60).stderr.splitlines() + subprocess.run(["docker", "logs", NAME], capture_output=True, text=True, timeout=60).stdout.splitlines() if '"logger"' not in line))
        raise
    finally:
        subprocess.run(["docker", "rm", "-f", NAME], capture_output=True, timeout=60)
        subprocess.run(["docker", "volume", "rm", VOLUME], capture_output=True, timeout=60)
