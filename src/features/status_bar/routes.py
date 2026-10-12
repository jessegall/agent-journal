from controllers.invoke import invoked
from controllers.types import Agents
from framework.routing import Reply, Request, handles


@handles("GET", "/api/{env}/bar")
def get_bar(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "bar"))
