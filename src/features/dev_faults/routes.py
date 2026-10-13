from features.dev_faults.diagnostics import LOG_PATH
from framework.lanes import TheJournalRoot
from framework.routing import Reply, Request, handles


@handles("GET", "/api/{env}/diagnostics")
def get_diagnostics(req: Request) -> Reply:
    return Reply(200, {"log": TheJournalRoot(req.record()).tail(LOG_PATH, req.asked_lines())})


@handles("POST", "/api/{env}/diagnostics/clear")
def post_clear_diagnostics(req: Request) -> Reply:
    log_file(req.root).unlink(missing_ok=True)
    return Reply(200, {"log": ""})
