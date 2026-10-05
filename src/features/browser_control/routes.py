from features.browser_control.controller import Asks
from features.format import VIEWER, shaped
from features.routing import Reply, Request, handles
from resources.base import USER
from resources.types import Ask


@handles("POST", "/api/{env}/browser/driver")
def post_driver(req: Request) -> Reply:
    Asks(req.record(), actor=USER)._drive(req.body.get("on"), req.body.get("url", ""), req.body.get("title", ""))
    return Reply(200, {"ok": True})


@handles("POST", "/api/{env}/browser/pending")
def post_pending(req: Request) -> Reply:
    asks = Asks(req.record(), actor=USER).pending()
    return Reply(200, {"data": [{"n": a.n, Ask.op: a.op, Ask.args: a.args} for a in asks]})


@handles("POST", "/api/{env}/browser/{n}/result")
def post_result(req: Request) -> Reply:
    got = Asks(req.record(), actor=USER).answer(int(req.params["n"]), req.body.get("text", ""), ok=bool(req.body.get("ok", True)), files=req.body.get("files") or [])
    return Reply(200, shaped(got, req.record(), VIEWER))
