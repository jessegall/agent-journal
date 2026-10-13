from functools import reduce

from events.agents import AgentReported, CommandRan
from events.git_actions import BranchNoted, BranchSwitched, GitActionDone
from expects import Dispatches, Given, Remembered, Updated, answering, nothing
from expects.playing import checked_out
from features.git_actions.details import GitActionsDetails
from features.git_actions.handlers import MarkTheBranchSwitch, MarkTheGitAction, NoteTheBranch
from features.git_actions.listeners import SpotBranchSwitch, SpotGitAction
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")
MAIN = checked_out("main")
STASHED = ("git", "stash", "show", "--name-only", "stash@{0}")
NO_SUCH_COMMIT = ("git", "rev-parse", "--verify", "-q", "nonexistent^{commit}")


def ran(command: str, output: str = "") -> CommandRan:
    return CommandRan(agent=1, tool="Bash", command=command, output=output)


def card(label: str) -> Updated:
    return Updated(AgentRow(n=1), cards=[{"label": label, "icon": "branch", "tone": "commit"}])


def marks(command: str, *labels: str, output: str = "", git: dict | None = None) -> Given:
    """What the git command is marked with in the chat, the checkout being the main one and git saying what is asked of it."""
    said = {("checkout",): MAIN, **(git or {})}
    done = reduce(lambda both, label: both & Dispatches(GitActionDone(agent=1, label=label)), labels[1:], Dispatches(GitActionDone(agent=1, label=labels[0]))) if labels else Dispatches(nothing)
    return Given(ran(command, output), rows=[AGENT_ROW], git=answering(said)) >> done


class GitActions(Feature):
    details = GitActionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentReported, SpotBranchSwitch(), expects=[
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): None})) >> Dispatches(nothing),
            Given(AgentReported(agent=1, hook="PreToolUse"), rows=[AGENT_ROW], git=answering({("checkout",): MAIN})) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): MAIN})) >> Dispatches(BranchNoted(agent=1, checkout=MAIN.name, branch="main")),
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): MAIN}), remembered={f"git_actions.{MAIN.name}|1": "main"}) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): checked_out("custom-rule-checks")}), remembered={f"git_actions.{MAIN.name}|1": "main"})
                >> Dispatches(BranchSwitched(agent=1, checkout=MAIN.name, branch="custom-rule-checks", label="The main checkout switched from `main` to `custom-rule-checks`")),
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): checked_out("worktree-ticket-16", top="/work/app-wt", linked=True)}))
                >> Dispatches(BranchSwitched(agent=1, checkout="worktree app-wt", branch="worktree-ticket-16", label="Worktree app-wt started on `worktree-ticket-16`")),
            Given(AgentReported(agent=1), rows=[AGENT_ROW], git=answering({("checkout",): checked_out("")})) >> Dispatches(nothing),
        ])
        journal.events.handle(BranchNoted, NoteTheBranch(), expects=[
            Given(BranchNoted(agent=1, checkout=MAIN.name, branch="main"), rows=[AGENT_ROW]) >> Remembered(f"{MAIN.name}|1", "main"),
        ])
        journal.events.handle(BranchSwitched, MarkTheBranchSwitch(), expects=[
            Given(BranchSwitched(agent=1, checkout=MAIN.name, branch="custom-rule-checks", label="The main checkout switched from `main` to `custom-rule-checks`"), rows=[AGENT_ROW])
                >> Remembered(f"{MAIN.name}|1", "custom-rule-checks") & card("The main checkout switched from `main` to `custom-rule-checks`"),
        ])
        journal.events.listen(CommandRan, SpotGitAction(), expects=[
            marks("git stash push -m wip", "Stashed 2 changed files", output="Saved working directory and index state On main: wip", git={STASHED: "a.txt\nb.txt\n"}),
            marks("git stash pop", "Popped the latest stash", output="On branch main"),
            marks("git stash drop", "Dropped the latest stash", output="Dropped refs/stash@{0} (abc)"),
            marks("git merge feature-x && git rebase -q main", "Merged `feature-x` into `main`", "Rebased `main` onto `main`"),
            marks("git cherry-pick abc1234def", "Cherry-picked `abc1234` onto `main`"),
            marks("git reset --hard HEAD~1", "Reset `main` hard to `HEAD~1`"),
            marks("git revert --no-edit abc1234", "Reverted `abc1234` on `main`"),
            marks("git tag v1.2", "Tagged `v1.2`"),
            marks("git -C . push origin main", "Pushed `main` to `origin`"),
            marks("git pull --rebase origin main", "Pulled `main` from `origin`"),
            marks("git fetch", "Fetched from `origin`"),
            marks("git worktree add ../wt -b helper-x", "Added worktree `../wt` on branch `helper-x`"),
            marks("git worktree remove ../wt", "Removed worktree `../wt`"),
            marks("git branch helper-y", "Created branch `helper-y`"),
            marks("git branch -D helper-y", "Deleted branch `helper-y`"),
            marks("git status && git log --oneline && git commit -m x && git stash list"),
            marks("git merge nope", output="fatal: nope - not something we can merge"),
            marks("""git commit -q -m "$(printf 'it'"'"'s done')" && git tag v1.3""", "Tagged `v1.3`"),
            marks("git branch -D quote-hotfix 2>&1 | tail -1", "Deleted branch `quote-hotfix`", output="Deleted branch quote-hotfix (was abc1234)."),
            marks("git worktree remove $S/quote-hotfix", "Removed worktree `quote-hotfix`"),
            marks('git worktree add "${S:?}/x-hotfix" origin/main', "Added worktree `x-hotfix` on branch `origin/main`"),
            marks("""git commit -q -m "$(printf 'subject\\n\\nbody')" """),
            marks("for c in v1.4 v1.5; do git tag $c; done; git tag $c"),
            marks('git tag "$e" && git tag -d "${e}" && git push origin "$e"'),
            marks("git -c core.pager=cat tag -d v1.2", "Deleted tag `v1.2`"),
            marks("git push --tags", "Pushed tags to `origin`"),
            marks("git push origin --delete old", "Deleted `old` on `origin`"),
            marks("git push --dry-run"),
            marks("git branch -m helper-z helper-w", "Renamed branch `helper-z` to `helper-w`"),
            marks("git fetch --all", "Fetched from every remote"),
            marks("git reset nonexistent", git={NO_SUCH_COMMIT: ""}),
            marks("git reset --soft", "Reset `main` soft to `HEAD`"),
            marks("git tag -l"),
            marks("git tag"),
            marks("git pull", output="Already up to date."),
            marks("git worktree list"),
            marks("git worktree add ../w2", "Added worktree `../w2`"),
            marks("git cherry-pick"),
            marks("git revert"),
            marks("git branch"),
            marks("git branch --list"),
            marks("ls -la"),
            Given(ran("git status"), rows=[AGENT_ROW], git=answering({("checkout",): None})) >> Dispatches(nothing),
            Given(CommandRan(agent=1, tool="Bash", command="git tag v1.2", stepped=True), rows=[AGENT_ROW], git=answering({("checkout",): MAIN})) >> Dispatches(nothing),
        ])
        journal.events.handle(GitActionDone, MarkTheGitAction(), expects=[
            Given(GitActionDone(agent=1, label="Pushed `main` to `origin`"), rows=[AGENT_ROW]) >> card("Pushed `main` to `origin`"),
        ])
