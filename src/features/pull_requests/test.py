from controllers.types import Notices
from runner.hooks import handle
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
    pinned = [(n.title, n.data.get("link")) for n in Notices(record).rows.standing()]
    assert pinned == [("Pull request 42 is open", "https://github.com/acme/app/pull/42")], "the opened pull request is pinned with its link"
    run("gh pr merge 42 --squash", "Merged pull request #42")
    assert [n for n in Notices(record).rows.standing() if n.data.get("pull")] == [], "merging it takes the pin away"
    run("cat <<'EOF'\nThe fix\nEOF\ngh pr create --title Fix --body-file body.md", "https://github.com/acme/app/pull/43\n")
    assert [n.data.get("pull") for n in Notices(record).rows.standing()] == ["43"], "a gh pr create on a line of its own, after a heredoc, is pinned too"


def test_a_commands_outcome_is_read_in_the_shape_of_each_runner():
    from providers.command_effects import outcome_of
    from providers.payload import BashCall, Hook, ReadCall

    def hook(command, stdout=""):
        return Hook(tool=BashCall.from_payload("Bash", {"command": command}, {"stdout": stdout}))

    outcome_for = lambda command, stdout, effect: outcome_of(hook(command, stdout), effect)
    broken = outcome_for("npm run build", "ERROR in ./src/a.js\nModule not found", "builds")
    clean = outcome_for("npm run build", "built in 2s", "builds")
    assert (broken.ok, clean.ok, outcome_for("npm run build", "", "builds")) == (False, True, None), "a build that printed an error failed, one that printed none worked, and one that printed nothing says nothing"
    assert outcome_for("ls", "x", "reads") is None, "an effect with no outcome to read has none"
    dotnet = outcome_for("dotnet test", "Failed: 2, Passed: 5, Skipped: 0", "tests")
    java = outcome_for("mvn test", "Tests run: 9, Failures: 1, Errors: 1, Skipped: 0", "tests")
    ruby = outcome_for("rspec", "12 examples, 3 failures", "tests")
    php = outcome_for("phpunit", "OK (7 tests, 9 assertions)", "tests")
    files = outcome_for("node run.js", "files failing: 4", "tests")
    assert ((dotnet.passed, dotnet.failed), (java.passed, java.failed), (ruby.passed, ruby.failed), (php.passed, php.failed), (files.passed, files.failed)) == \
        ((5, 2), (7, 2), (9, 3), (7, 0), (0, 4)), "test results are read in the shape of each runner"
    assert outcome_for("pytest", "no summary at all", "tests") is None, "a run that printed no tally says nothing"
    pull = outcome_for("gh pr create --title x", "https://github.com/a/b/pull/12", "pulls")
    quiet = outcome_for("gh pr merge 7", "", "pulls")
    assert (pull.pull, pull.number, pull.url, quiet.pull, quiet.number) == ("create", "12", "https://github.com/a/b/pull/12", "merge", "7"), "a pull request is read from its address or from the number asked for"
    assert outcome_for("echo hi", "", "pulls") is None, "a command that is no pull request step says nothing"
    assert outcome_of(Hook(tool=ReadCall("Read", {}, {})), "builds") is None, "a call that is no command has nothing printed"
