from dataclasses import dataclass
from pathlib import Path

from controllers.base import CONTROLLERS
from controllers.messages import Messages
from features.format import SHARED, formatted
from features.sharing.details import ANSWERED
from features.sharing.visitors import count_sent, index_comment, visitor_name, visitor_text
from resources.base import AGENT, SYSTEM, Refused, titled


def sharing_feature():
    from features import running
    from features.sharing.feature import SharingFeature
    return running(SharingFeature)


@dataclass(frozen=True)
class SharedComment:
    n: int
    about: str
    name: str
    text: str
    created: float
    replies: tuple = ()
    options: tuple = ()
    answer: str = ""
    handled: str | None = None

    @classmethod
    def of(cls, comment, about: str, record, replies: tuple = ()) -> "SharedComment":
        name = "Agent" if comment.seen[:1] == [AGENT] else comment.data["visitor"]
        return cls(comment.n, about, name, comment.brief, comment.created, replies, tuple(comment.data.get("options", ())), comment.data.get("answer", ""),
                   formatted(comment.outcome, record, SHARED) if comment.completed else None)


class ShareVisits:
    def _visitor_answer(self, share, n: int, name: str, choice: str):
        from controllers.types import Comments
        asked = next((comment for c in self._shared_comments(share, self._scope(share)) for comment in (c, *c.replies) if comment.n == n), None)
        if asked is None or not asked.options:
            raise Refused("that question is not on this link")
        if asked.answer:
            raise Refused("that question is answered")
        if choice not in asked.options:
            raise Refused("pick one of the question's options")
        name = visitor_name(name)
        record = self._home(share)
        comments = Comments(record, actor=SYSTEM)
        made = comments.update(n, answer=choice, answered_by=name)
        if share.password:
            sharing_feature().to_primary(record, ANSWERED, name=name, n=n, choice=choice)
        else:
            self._hold_visitor_comment(record, made, comments.path(n), f"{name} answered your question in comment {n} through a shared link", choice)
        return made

    def _visitor_comment(self, share, ref: str, name: str, text: str):
        if not share.comments:
            raise Refused("this link does not take comments")
        if ref not in self._scope(share):
            raise Refused("that is not part of this link")
        name, text = visitor_name(name), visitor_text(text)
        count_sent(share.token)
        from controllers.types import Comments
        record = self._home(share)
        comments = Comments(record, actor=SYSTEM)
        made = comments.create(f"Comment from {name}", brief=text, about=ref, visitor=name, share=share.n, trusted=bool(share.password))
        if not made.data["trusted"]:
            self._hold_visitor_comment(record, made, comments.path(made.n), f"{name} commented on {ref.replace(':', ' ')} through a shared link", text)
        kind, _, n = ref.partition(":")
        about = CONTROLLERS[kind](record, actor=SYSTEM)
        about.save(about.load(n), "commented", comment=made.n)
        return made

    def _hold_visitor_comment(self, record, comment, path: Path, title: str, text: str) -> None:
        index_comment(record, comment, path)
        Messages(record, actor=AGENT).create(
            titled(title),
            brief=f"{text}\n\nThe link has no password, so the agent does not act on this unless you let it.",
            buttons=[{"label": "Let the agent act on it", "type": "share", "n": comment.n, "action": "allow"}],
        )

    def _shared_comments(self, share, scope: set[str]) -> list[SharedComment]:
        from controllers.types import Comments
        comments = Comments(self._home(share), actor=SYSTEM)
        rows = [row for row in comments.rows.summaries() if not row["deleted"]]

        def about(refs: set[str]) -> list:
            return [comments.load(row["n"]) for row in rows if refs.intersection(row["refs"])]

        visitors = [c for c in about(scope) if c.data.get("share") == share.n]
        asked = {c.ref for c in visitors}
        agents = [c for c in about(scope | asked) if share.agent_replies and c.seen[:1] == [AGENT]]
        top = sorted([*visitors, *(c for c in agents if scope.intersection(c.refs))], key=lambda c: c.created)
        threads = []
        for c in top:
            on = next(ref for ref in c.refs if ref in scope)
            threads.append(SharedComment.of(c, on, comments.record, tuple(SharedComment.of(r, on, comments.record) for r in agents if c.ref in r.refs)))
        return threads
