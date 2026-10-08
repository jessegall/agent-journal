from engine.sessions import Sessions
from engine.wording import clipped
from features.parts import Context
from features.sequences.details import DISPATCH
from features.sequences.resource import RunKey
from providers import dispatch_model
from controllers.types import Agents, Messages
from engine.extension import Extension

REQUEST_TEXT = 400
DISPATCH_MODELS = Extension()
BOARD_OF_MESSAGE = Extension()


def unchosen(record, provider: str) -> str:
    return ""


def board_of(context: Context, about: str) -> int:
    kind, _, n = about.partition(":")
    if kind == "board":
        return int(n)
    if kind != "message" or not n.isdigit():
        return 0
    message = context.journal.get(Messages).load(n)
    return next((board for board in (found(context.record, message) for found in BOARD_OF_MESSAGE.each(context.record)) if board), 0)


def request_of(context: Context, about: str) -> str:
    kind, _, n = about.partition(":")
    if kind != "message" or not n.isdigit():
        return ""
    message = context.journal.get(Messages).load(n)
    text = " ".join((message.brief or message.title).split())
    return clipped(text, REQUEST_TEXT)


def working_agent(context: Context):
    holder = Sessions(context.record.root).holder(context.record.env)
    return (context.journal.get(Agents).rows.by_title(holder) if holder else None) or context.journal.get(Agents).primary()


def dispatched_by_line(context: Context, agent, sequence, key: str, why: str) -> None:
    about = RunKey.of(key).about
    board = board_of(context, about)
    if not board:
        return
    Sessions(context.record.root).grant(agent.title, context.record.env)
    models = DISPATCH_MODELS.keyed(context.record)
    speaking = context.speaking_to(agent)
    speaking.once(DISPATCH, f"{sequence.n}|{key}|{sequence.started(key)}|{why}", lambda: speaking.agent.say(
        DISPATCH, kind=sequence.dispatch, n=sequence.n, title=sequence.title, about=about, board=board,
        model=dispatch_model(agent.provider, models.get(sequence.dispatch, unchosen)(context.record, agent.provider)), why=why,
        request=request_of(context, about)))
