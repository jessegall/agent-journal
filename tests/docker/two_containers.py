"""An owner's journal on a server and a member's copy in containers of their own, on a real network: the sync and the login page as they run in production.

Run it by hand, outside the default suite: python3 tests/docker/two_containers.py. It builds the image from docker/Dockerfile,
starts the server, a proxy in front of it and the copy on a network of their own, checks each case and prints it, and removes
every container, the network and the image it made, whether the checks pass or not.
"""
import json
import subprocess
import sys
import tempfile
import time
import uuid
from contextlib import contextmanager
from pathlib import Path

REPOSITORY = Path(__file__).resolve().parents[2]
ADDRESS = "journal.test"
ENV = "main"
PASSWORD = "a long owner password"
CADDY = "caddy@sha256:226d1f059b75399fe19182893c7184591c07b97afc8dfcf44eeb80c9a77a530f"
BUILD_WITHIN = 1200
READY_WITHIN = 180
COMMAND_WITHIN = 120
STREAM_ENDS_WITHIN = 60
SERVER_ROOT = "/data/project/.journal"
COPY_PROJECT = "/tmp/project"
COPY_ROOT = f"{COPY_PROJECT}/.journal"
CODE = "/opt/agent-journal/src"

PROXY = f"""{{
    auto_https off
}}

http://{ADDRESS} {{
    reverse_proxy journal:8440 {{
        header_up X-Forwarded-Proto https
        flush_interval -1
    }}
}}
"""


class Failed(AssertionError):
    pass


def docker(*words: str, within: float = COMMAND_WITHIN, check: bool = True) -> str:
    done = subprocess.run(["docker", *words], capture_output=True, text=True, timeout=within)
    if check and done.returncode != 0:
        raise Failed(f"docker {' '.join(words[:3])} failed: {done.stderr.strip() or done.stdout.strip()}")
    return done.stdout.strip()


class World:
    """The server, its proxy and the member's copy, named for this run so a second run never meets the first."""

    def __init__(self) -> None:
        run = uuid.uuid4().hex[:8]
        self.image = f"agent-journal-sync-test:{run}"
        self.network = f"aj-sync-{run}"
        self.server = f"aj-server-{run}"
        self.proxy = f"aj-proxy-{run}"
        self.copy = f"aj-copy-{run}"
        self.started: list[str] = []

    def build(self) -> None:
        docker("build", "-q", "-f", str(REPOSITORY / "docker" / "Dockerfile"), "-t", self.image, str(REPOSITORY), within=BUILD_WITHIN)

    def start(self, place: Path) -> None:
        docker("network", "create", self.network)
        self.run(self.server, "--network-alias", "journal", "-e", f"JOURNAL_ADDRESS={ADDRESS}", self.image)
        (place / "Caddyfile").write_text(PROXY)
        self.run(self.proxy, "--network-alias", "caddy", "--network-alias", ADDRESS, "-v", f"{place / 'Caddyfile'}:/etc/caddy/Caddyfile:ro", CADDY)
        self.run(self.copy, "--entrypoint", "sleep", self.image, "infinity")
        self.wait_until_ready()
        self.as_copy_shell(f"mkdir -p {COPY_PROJECT} && cd {COPY_PROJECT} && git init -q && AGENT_JOURNAL_BOOTSTRAPPED=1 python3 {CODE}/install.py upgrade {COPY_PROJECT} >/dev/null")

    def run(self, name: str, *rest: str) -> None:
        docker("run", "-d", "--name", name, "--network", self.network, *rest)
        self.started.append(name)

    def wait_until_ready(self) -> None:
        began = time.time()
        while time.time() - began < READY_WITHIN:
            if docker("exec", self.server, "curl", "-fsS", "http://127.0.0.1:8440/ready", check=False):
                return
            time.sleep(2)
        raise Failed(f"the server was not ready within {READY_WITHIN} seconds")

    def on_server(self, *words: str) -> str:
        """A journal command on the server, as the user, run by the journal's own account."""
        return docker("exec", "-u", "journal", "-w", "/data/project", "-e", "HOME=/data/home", self.server,
                      "python3", f"{SERVER_ROOT}/journal.py", "--root", SERVER_ROOT, "--env", ENV, "--as", "user", *words)

    def on_gateway(self, *words: str) -> str:
        """A command of the login page's own, run by its account, as the owner runs it from the server's shell."""
        return docker("exec", "-u", "gateway", self.server, "hosted-journal", *words)

    def on_copy(self, *words: str) -> str:
        return docker("exec", "-w", COPY_PROJECT, self.copy, "python3", f"{COPY_ROOT}/journal.py", "--root", COPY_ROOT, "--env", ENV, "--as", "user", *words)

    def as_copy_shell(self, script: str) -> str:
        return docker("exec", self.copy, "sh", "-c", script)

    def in_copy_python(self, code: str) -> str:
        return docker("exec", "-e", f"PYTHONPATH={CODE}", self.copy, "python3", "-c", f"import features; features.load()\n{code}")

    def copy_holds(self) -> bool:
        return self.in_copy_python(f"""
from pathlib import Path
from engine.record import Record
print(Record(Path('{COPY_ROOT}'), '{ENV}').holds(''))""") == "True"

    def server_holds(self) -> bool:
        """Whether the server writes the environment, as the copy is told when it asks who holds it."""
        return self.in_copy_python(f"""
from features.connection.transport import HttpTransport, ServerKey
server = HttpTransport('http://{ADDRESS}', ServerKey('{COPY_ROOT}').read())
print(server.holder('{ENV}').machine == server.hello().machine)""") == "True"

    def holders(self) -> str:
        """The lease each side keeps for the environment, as the two sides see it."""
        return self.in_copy_python(f"""
from pathlib import Path
from engine.machines import Lease, this_machine
from engine.record import Record
from features.connection.transport import HttpTransport, ServerKey
server = HttpTransport('http://{ADDRESS}', ServerKey('{COPY_ROOT}').read())
print('copy', this_machine()[:8], 'keeps', Lease.read(Record(Path('{COPY_ROOT}'), '{ENV}').scope_home('')), '| server', server.hello().machine[:8], 'names', server.holder('{ENV}'))""")

    def queue(self, *requests: tuple[str, list]) -> None:
        """Writes made on the copy into the environment the server holds, queued for the next sync as the journal queues them."""
        made = ", ".join(f"Request('{ENV}', 'todo', {word!r}, {args!r}, actor='user')" for word, args in requests)
        self.in_copy_python(f"""
from pathlib import Path
from controllers.requests import request
from engine.outbox import Request
for asked in ({made},):
    request(Path('{COPY_ROOT}'), asked)""")

    def server_titles(self) -> list[str]:
        """The titles of the server's to-dos, oldest first, read where they are kept."""
        code = f"""import features; features.load()
import json
from pathlib import Path
from controllers.types import Todos
from engine.record import Record
print(json.dumps([row.title for row in sorted(Todos(Record(Path('{SERVER_ROOT}'), '{ENV}'), actor='system').all(), key=lambda row: row.created)]))"""
        return json.loads(docker("exec", "-u", "journal", "-e", f"PYTHONPATH={CODE}", self.server, "python3", "-c", code))

    def tear_down(self) -> None:
        for name in self.started:
            docker("rm", "-f", name, check=False)
        docker("network", "rm", self.network, check=False)
        docker("rmi", "-f", self.image, check=False)


def case(said: str, holds: bool) -> None:
    if not holds:
        raise Failed(said)
    print(f"ok  {said}", flush=True)


def connect(world: World) -> None:
    key = world.on_gateway("machine-key", "--name", "member").split("shown only now: ", 1)[1].split()[0]
    world.on_copy("feature", "switch", "connection")
    case("the copy connects through the proxy and the login page with the machine key the owner made",
         "connected" in world.on_copy("environment", "connect", "--address", f"http://{ADDRESS}", "--key", key))
    case("the copy hands its environment to the server", "from epoch" in world.on_copy("environment", "hand", ENV, "server"))


def writes_arrive_both_ways(world: World) -> None:
    world.on_server("todo", "create", "Written on the server")
    world.on_copy("environment", "sync")
    case("a write made on the server arrives on the copy", world.in_copy_python(f"""
from pathlib import Path
from engine.record import Record
print(any(e.type == 'todo' and e.action == 'created' for e in Record(Path('{COPY_ROOT}'), '{ENV}').event_log.events()))""") == "True")
    world.queue(("create", ["First from the copy"]), ("create", ["Second from the copy"]))
    world.on_copy("environment", "sync")
    titles = world.server_titles()
    case("writes the copy made into the environment the server holds land there, in the order they were made",
         "First from the copy" in titles and titles.index("First from the copy") < titles.index("Second from the copy"))


def a_refused_write_does_not_block(world: World) -> None:
    world.queue(("create", ["Before the refused one"]), ("complete", [999999]), ("create", ["After the refused one"]))
    world.on_copy("environment", "sync")
    titles = world.server_titles()
    case("a write the server refuses is set aside and the writes after it still land",
         "Before the refused one" in titles and "After the refused one" in titles)
    case("and the copy is left a notice naming it", "turned down" in world.on_copy("notice", "all"))


def a_cut_network_leaves_one_holder(world: World) -> None:
    taking_back = subprocess.Popen(["docker", "exec", "-w", COPY_PROJECT, world.copy, "python3", f"{COPY_ROOT}/journal.py", "--root", COPY_ROOT,
                                    "--env", ENV, "--as", "user", "environment", "hand", ENV, "here"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    time.sleep(0.3)
    docker("network", "disconnect", world.network, world.copy)
    try:
        answered = taking_back.communicate(timeout=COMMAND_WITHIN)[0].strip()
    finally:
        docker("network", "connect", world.network, world.copy)
    print(f"    the handback cut off answered: {answered or '(nothing)'}", flush=True)
    print(f"    after the cut: {world.holders()}", flush=True)
    case("a network cut in the middle of a handback never leaves two holders", not (world.copy_holds() and world.server_holds()))
    retried = world.on_copy("environment", "hand", ENV, "here")
    print(f"    the handback again answered: {retried}; after it: {world.holders()}", flush=True)
    case("and running it again leaves exactly one", world.copy_holds() != world.server_holds())


def log_out_everywhere_ends_a_stream(world: World) -> None:
    code = world.on_gateway("setup-code").rsplit(" ", 1)[1]
    form = f"code={code}&password={PASSWORD.replace(' ', '+')}&again={PASSWORD.replace(' ', '+')}"
    headers = world.as_copy_shell(f"curl -s -D - -o /dev/null -H 'Origin: https://{ADDRESS}' --data '{form}' http://{ADDRESS}/setup")
    cookie = next(line.split(":", 1)[1].split(";")[0].strip() for line in headers.splitlines() if line.lower().startswith("set-cookie:") and "journal=" in line)
    streaming = subprocess.Popen(["docker", "exec", world.copy, "curl", "-sN", "-H", f"Cookie: {cookie}", "-H", "Accept: text/event-stream",
                                  f"http://{ADDRESS}/api/{ENV}/stream"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(3)
    case("a logged-in browser holds a live stream open", streaming.poll() is None)
    world.on_gateway("logout-everywhere")
    try:
        streaming.wait(STREAM_ENDS_WITHIN)
    except subprocess.TimeoutExpired:
        streaming.kill()
        raise Failed(f"log-out-everywhere in the server's container did not end the open stream within {STREAM_ENDS_WITHIN} seconds") from None
    case("log-out-everywhere in the server's container ends the stream", True)


@contextmanager
def world_running():
    world = World()
    with tempfile.TemporaryDirectory() as place:
        try:
            world.build()
            world.start(Path(place))
            yield world
        finally:
            world.tear_down()


def main() -> int:
    try:
        with world_running() as world:
            for check in (connect, writes_arrive_both_ways, a_refused_write_does_not_block, a_cut_network_leaves_one_holder, log_out_everywhere_ends_a_stream):
                check(world)
    except (Failed, subprocess.TimeoutExpired) as failed:
        print(f"FAILED  {failed}", file=sys.stderr, flush=True)
        return 1
    print("every case passed", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
