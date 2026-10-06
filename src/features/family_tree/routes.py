from features.family_tree.tree import family
from features.routing import Reply, Request, handles


@handles("GET", "/api/{env}/family")
def get_family(req: Request) -> Reply:
    return Reply(200, family(req.record()))
