from features.routing import Reply, Request, handles


@handles("GET", "/api/{env}/bar")
def get_bar(req: Request) -> Reply:
    from features.status_bar.bar import current
    return Reply(200, current(req.record()))
