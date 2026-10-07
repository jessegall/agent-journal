from dataclasses import dataclass

from features.routing import Named, Route

RUNS_ALLOWED = False


@dataclass(frozen=True)
class Endpoint:
    """A desktop page, named by its route's method and pattern; a placeholder may be narrowed to one value, as tool for {type}."""

    method: str
    pattern: str

    @property
    def narrowness(self) -> int:
        return sum(not part.startswith("{") for part in self.pattern.split("/"))

    def covers(self, route: Route, params: dict) -> bool:
        ours, theirs = self.pattern.split("/"), route.pattern.split("/")
        return self.method == route.method and len(ours) == len(theirs) and all(
            mine == its or (its.startswith("{") and params[its[1:-1]] == mine) for mine, its in zip(ours, theirs))


def get(pattern: str) -> Endpoint:
    return Endpoint("GET", pattern)


def post(pattern: str) -> Endpoint:
    return Endpoint("POST", pattern)


def writes(type_: str) -> tuple[Endpoint, ...]:
    return post(f"/api/{{env}}/{type_}"), post(f"/api/{{env}}/{type_}/{{action}}"), post(f"/api/{{env}}/{type_}/{{n}}/{{action}}")


ALLOWED = (
    get("/api/changelog"), get("/api/extension"), get("/api/identity"), get("/api/manifest"), get("/api/pages"),
    get("/api/plugins/{name}/log"), get("/api/services"), get("/api/services/{id}/log"),
    get("/api/{env}/{type}"), get("/api/{env}/{type}/{n}"), get("/api/{env}/dashboard"), get("/api/{env}/diagnostics"),
    get("/api/{env}/diff"), get("/api/{env}/family"), get("/api/{env}/file"), get("/api/{env}/files"),
    get("/api/{env}/plugin/{n}/dashboard/{name}"), get("/api/{env}/project-files"), get("/api/{env}/project-files/find"),
    get("/api/{env}/search"), get("/api/{env}/settings"), get("/api/{env}/skills"), get("/api/{env}/skills/{name}"),
    post("/api/identity"), post("/api/journals/forget"), post("/api/update/check"), post("/api/{env}/settings"),
    post("/api/{env}/{type}"), post("/api/{env}/{type}/{action}"), post("/api/{env}/{type}/{n}/{action}"),
    post("/api/{env}/{type}/{n}/upload"), post("/api/{env}/{type}/read-all"), post("/api/{env}/agent/{session}/relaunch"),
    post("/api/{env}/skills/{name}/always"), post("/api/{env}/skills/{name}/keywords"), post("/api/{env}/skills/{name}/load"),
    post("/api/{env}/environment"), post("/api/{env}/phone/{n}/disconnect"),
    post("/api/{env}/plugin/{n}/clear_log"), post("/api/{env}/plugin/{n}/configure"), post("/api/{env}/plugin/{n}/disable"),
    post("/api/{env}/plugin/{n}/purge"), post("/api/{env}/plugin/{n}/remove"),
)

RUNS = (
    post("/api/{env}/agent/{session}/keys"), post("/api/{env}/agent/{session}/shell"),
    *writes("tool"), *writes("check"), post("/api/{env}/sequence/{n}/run"),
    *writes("plugin"), post("/api/{env}/plugins/preview"), post("/api/{env}/plugins/{n}/upgrade-preview"),
    post("/api/services/{id}"), post("/api/stop"), post("/api/update"), post("/api/upgrade"),
)

NEVER = (
    post("/api/{env}/environment/{action}"), post("/api/{env}/environment/{n}/{action}"),
    *writes("phone"), get("/api/{env}/phone"), get("/api/{env}/phone/{n}"),
)

LISTS = ((ALLOWED, True), (RUNS, RUNS_ALLOWED), (NEVER, False))


def allowed(route: Route, params: dict) -> bool:
    """The narrowest entry that names the page decides, a refusal winning a tie; a page no entry names is refused."""
    naming = [(endpoint.narrowness, not verdict) for listed, verdict in LISTS for endpoint in listed if endpoint.covers(route, params)]
    return bool(naming) and not max(naming)[1]


def reached(route: Route, params: dict, query: dict, body: dict, environment: str) -> bool:
    """Whether a phone in this environment may reach the page, with every environment the path, query and body name its own."""
    named = {Named.from_json(given).env for given in (params, query, body)} - {""}
    return allowed(route, params) and named <= {environment}
