from controllers.invoke import invoked
from controllers.types import Agents
from features.routing import Reply, Request, handles


@handles("GET", "/api/{env}/family")
def get_family(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "family"))
