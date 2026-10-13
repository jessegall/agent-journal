from controllers.types import Agents
from framework.routing import Reply, Request, handles


@handles("GET", "/api/{env}/family")
def get_family(req: Request) -> Reply:
    return Reply(200, req.invoke(Agents, "family"))
