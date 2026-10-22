import json
import urllib.error
import urllib.request

from journal.sync.team_account import TeamAccount
from journal.sync.team_refusal import TeamRefusal
from sync_server.blocks_answer import BlocksAnswer
from sync_server.pull_answer import PullAnswer
from sync_server.push_answer import PushAnswer

REQUEST_SECONDS = 10


class TeamServerLink:
    """The one way the journal reaches its team server: a push of queued changes, a pull past a sequence and a request for blocks of row numbers, each with the device's token. A network fault is raised as the OSError it is; a refusal as a TeamRefusal."""

    def __init__(self, account: TeamAccount) -> None:
        self.account = account

    def send_changes(self, changes: list[dict], clock_offset: float) -> PushAnswer:
        return PushAnswer.parsed(**json.loads(self.sent("/push", json.dumps({"changes": changes, "clock_offset": clock_offset}).encode(), REQUEST_SECONDS)))

    def fetch_changes(self, sequence: int, wait_seconds: float) -> PullAnswer:
        return PullAnswer.parsed(**json.loads(self.sent(f"/pull?after={sequence}&wait={wait_seconds}", None, wait_seconds + REQUEST_SECONDS)))

    def fetch_blocks(self, tables: list[str]) -> BlocksAnswer:
        return BlocksAnswer.parsed(**json.loads(self.sent("/blocks", json.dumps({"tables": tables}).encode(), REQUEST_SECONDS)))

    def sent(self, path: str, body: bytes | None, seconds: float) -> bytes:
        request = urllib.request.Request(self.account.address() + path, data=body, headers={"Authorization": f"Bearer {self.account.token()}", "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(request, timeout=seconds) as answer:
                return answer.read()
        except urllib.error.HTTPError as refused:
            raise TeamRefusal(json.loads(refused.read() or b"{}").get("error", f"the team server answered {refused.code}")) from refused
