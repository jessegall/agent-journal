from events import Fact
from events.agents import AgentReported
from events.close_from_commits import CommitMade, LogRead, TrailerFound
from features.close_from_commits.trailers import REFLOG, TRAILER, Commit, commits_of, landing_args, reflog_of
from payload import HookEvent
from receiving import Listener
from resources.checkout import Checkout
from resources.text import digest
from resources.types import AgentRow
from serving import ReadElsewhere, ReadGit, ReadRemembered, ReadRows

MADE_HERE = "commit"


def stamp_key(path) -> str:
    return f"stamp|{digest(str(path), 12)}"


class SpotCommit(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], git: ReadGit, elsewhere: ReadElsewhere, remembered: ReadRemembered) -> list[Fact]:
        if event.hook == HookEvent.PRE_TOOL_USE:
            return []
        checkout = git.checkout(elsewhere.here().working_folder(agents.peek(event.agent)))
        if not checkout:
            return []
        facts, stamps, cursors = [], [], []
        if (head := self.moved(git, remembered, checkout.head_log)):
            stamps.append(head)
            facts += self.made_here(event.agent, checkout, git, remembered, cursors)
        if checkout.landing and not checkout.linked and (landing := self.moved(git, remembered, checkout.landing_log)):
            stamps.append(landing)
            facts += self.landed(event.agent, checkout, git, remembered, cursors)
        return [*facts, LogRead(stamps=tuple(stamps), cursors=tuple(cursors))] if stamps else []

    @staticmethod
    def moved(git: ReadGit, remembered: ReadRemembered, log) -> tuple[str, int] | None:
        """The log's stamp, when it has changed since it was last looked at."""
        stamp, key = git.stamp(log), stamp_key(log)
        return (key, stamp) if stamp and stamp != remembered.get(key) else None

    def made_here(self, agent: int, checkout: Checkout, git: ReadGit, remembered: ReadRemembered, cursors: list) -> list[Fact]:
        commits = reflog_of(git.run(checkout.top, *REFLOG))
        if not commits:
            return []
        cursor = f"cursor|{digest(str(checkout.head_log), 12)}"
        seen = remembered.get(cursor) or ""
        shas = [sha for sha, *_ in commits]
        # The place is lost when the commit last looked at is no longer in the reflog window, which a rebase, a cherry-pick or a
        # stretch busier than the window all do. Then the whole window is read rather than none of it, since closing a row that is
        # already closed does nothing, and only the cards are left out, which would say the same thing twice.
        lost = seen not in shas
        cursors.append((cursor, commits[0][0]))
        facts = []
        for sha, action, subject, body in commits if lost else commits[:shas.index(seen)]:
            if not action.startswith(MADE_HERE):
                continue
            facts += [] if lost else [CommitMade(agent=agent, sha=sha, subject=subject, branch=checkout.branch)]
            facts += self.trailers(agent, Commit(sha, subject, body), held_only=False)
        return facts

    def landed(self, agent: int, checkout: Checkout, git: ReadGit, remembered: ReadRemembered, cursors: list) -> list[Fact]:
        cursor = f"landed|{digest(checkout.landing, 12)}"
        seen = remembered.get(cursor) or ""
        tip = git.run(checkout.top, "rev-parse", checkout.landing).strip()
        cursors.append((cursor, tip))
        if seen == tip:
            return []
        commits = commits_of(git.run(checkout.top, *landing_args(f"{seen}..{tip}" if seen else tip)))
        return [fact for commit in commits for fact in self.trailers(agent, commit, held_only=not seen)]

    @staticmethod
    def trailers(agent: int, commit: Commit, held_only: bool) -> list[Fact]:
        return [TrailerFound(agent=agent, sha=commit.sha, subject=commit.subject, body=commit.body, held_only=held_only)] if TRAILER.search(commit.body) else []
