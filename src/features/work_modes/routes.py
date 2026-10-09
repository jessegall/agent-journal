from engine.record import Record
from features.routing import Reply, Request, handles
from resources.base import USER


@handles("POST", "/api/{env}/mode")
def post_mode(req: Request) -> Reply:
    from features.work_modes.modes import pick
    return Reply(200, {"mode": pick(Record(req.root, req.params["env"]), str(req.body.get("mode", "")), USER)})


@handles("POST", "/api/{env}/mode/board")
def post_board(req: Request) -> Reply:
    from features.work_modes.modes import choose_board
    return Reply(200, {"board": choose_board(Record(req.root, req.params["env"]), int(req.body.get("board", 0)), USER)})
