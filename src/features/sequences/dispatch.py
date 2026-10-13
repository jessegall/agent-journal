from resources.text import clipped
from resources.extension import Extension

REQUEST_TEXT = 400
DISPATCH_MODELS = Extension()
BOARD_OF_MESSAGE = Extension()


def unchosen(record, provider: str) -> str:
    return ""


def board_of(messages, record, about: str) -> int:
    kind, _, n = about.partition(":")
    if kind == "board":
        return int(n)
    if kind != "message" or not n.isdigit():
        return 0
    message = messages.load(n)
    return next((board for board in (found(record, message) for found in BOARD_OF_MESSAGE.each(record)) if board), 0)


def request_of(messages, about: str) -> str:
    kind, _, n = about.partition(":")
    if kind != "message" or not n.isdigit():
        return ""
    message = messages.load(n)
    text = " ".join((message.brief or message.title).split())
    return clipped(text, REQUEST_TEXT)
