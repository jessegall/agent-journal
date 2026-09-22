from controllers.types import Notices
from engine.hooks import handle
from providers import PROVIDERS
from tests.conftest import fresh


def test_a_pull_request_the_agent_opens_is_pinned_until_it_is_merged():
    record = fresh()
    claude = PROVIDERS["claude"]()

    def run(command: str, printed: str = "") -> None:
        call = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}}
        handle(claude, record.root, record.env, {**call, "hook_event_name": "PreToolUse"})
        handle(claude, record.root, record.env, {**call, "hook_event_name": "PostToolUse", "tool_response": {"stdout": printed}})

    run('gh pr create --title "Queue autoscaler" --body "v1"', "https://github.com/acme/app/pull/42\n")
    pinned = [(n.title, n.data.get("link")) for n in Notices(record)._standing()]
    assert pinned == [("Pull request 42 is open", "https://github.com/acme/app/pull/42")], "the opened pull request is pinned with its link"
    run("gh pr merge 42 --squash", "Merged pull request #42")
    assert [n for n in Notices(record)._standing() if n.data.get("pull")] == [], "merging it takes the pin away"
