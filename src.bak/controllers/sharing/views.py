from dataclasses import asdict, dataclass

from controllers.messages import Messages
from controllers.works import Works
from engine.record import Record
from engine.seats import live
from framework.format import SHARED, formatted
from resources.base import SYSTEM

VIEWS = ("agents", "chat")
CHAT_LINES = 100


@dataclass(frozen=True)
class AgentLine:
    name: str
    state: str
    work: str


@dataclass(frozen=True)
class ChatLine:
    author: str
    text: str
    at: float


def agent_lines(record: Record) -> list[dict]:
    lines = []
    for _, agent in live(record.root):
        work = Works(Record(record.root, agent.environment), actor=SYSTEM).rows.standing()
        lines.append(AgentLine(agent.session, agent.status, next((w.title for w in work if not w.parked), "")))
    return [asdict(line) for line in lines]


def chat_lines(record: Record) -> list[dict]:
    messages = Messages(record, actor=SYSTEM)
    lines = []
    for message in sorted(messages.rows.every(), key=lambda row: row.created)[-CHAT_LINES:]:
        lines.append(ChatLine(message.author, formatted(message.brief or message.title, record, SHARED), message.created))
        lines += [ChatLine(reply.author, formatted(reply.brief or reply.title, record, SHARED), reply.created) for reply in messages.comments(message.n)]
    return [asdict(line) for line in sorted(lines, key=lambda line: line.at)[-CHAT_LINES:]]


@dataclass(frozen=True)
class SharedView:
    """One of the views a share can open on its own, with the lines it shows."""
    kind: str
    lines: list

    @classmethod
    def of(cls, record: Record, view: str) -> "SharedView":
        return cls(view, agent_lines(record) if view == "agents" else chat_lines(record))


def shared_view(record: Record, view: str) -> SharedView:
    return SharedView.of(record, view)
