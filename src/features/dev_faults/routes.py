from engine.disk import last_lines
from features.dev_faults.diagnostics import log_file
from features.routing import Reply, Request, handles


@handles("GET", "/api/{env}/diagnostics")
def get_diagnostics(req: Request) -> Reply:
    return Reply(200, {"log": last_lines(log_file(req.root), req.asked_lines())})


@handles("POST", "/api/{env}/diagnostics/clear")
def post_clear_diagnostics(req: Request) -> Reply:
    log_file(req.root).unlink(missing_ok=True)
    return Reply(200, {"log": ""})
