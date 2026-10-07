from dataclasses import dataclass
from pathlib import Path

from engine.paths import known_environment
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
    get("/api/agent-controls/{provider}"), get("/api/agents"), get("/api/changelog"), get("/api/extension"), get("/api/identity"),
    get("/api/manifest"), get("/api/pages"), get("/api/{env}/agent/{n}/terminal"), get("/api/{env}/commit/{sha}"),
    get("/api/{env}/events"),
    get("/api/plugins/{name}/log"), get("/api/services"), get("/api/services/{id}/log"),
    get("/api/{env}/{type}"), get("/api/{env}/{type}/{n}"), get("/api/{env}/dashboard"), get("/api/{env}/diagnostics"),
    get("/api/{env}/diff"), get("/api/{env}/family"), get("/api/{env}/file"), get("/api/{env}/files"),
    get("/api/{env}/plugin/{n}/dashboard/{name}"), get("/api/{env}/project-files"), get("/api/{env}/project-files/find"),
    get("/api/{env}/search"), get("/api/{env}/settings"), get("/api/{env}/skills"), get("/api/{env}/skills/{name}"),
    post("/api/identity"), post("/api/journals/forget"), post("/api/update/check"),
    post("/api/{env}/{type}"), post("/api/{env}/{type}/{action}"), post("/api/{env}/{type}/{n}/{action}"),
    post("/api/{env}/{type}/{n}/upload"), post("/api/{env}/{type}/read-all"), post("/api/{env}/agent/{session}/relaunch"),
    post("/api/{env}/skills/{name}/always"), post("/api/{env}/skills/{name}/keywords"), post("/api/{env}/skills/{name}/load"),
    post("/api/{env}/agent/{session}/control"), post("/api/{env}/appoint"), post("/api/{env}/phone/{n}/disconnect"),
    post("/api/{env}/plugin/{n}/clear_log"), post("/api/{env}/plugin/{n}/configure"), post("/api/{env}/plugin/{n}/disable"),
    post("/api/{env}/plugin/{n}/purge"), post("/api/{env}/plugin/{n}/remove"),
)

# Allowed until question 206 is answered, then weighed with RUNS.
TO_WEIGH = (
    post("/api/{env}/helper/dispatch"), post("/api/{env}/ticket/{n}/start"), post("/api/{env}/worktree/cut"),
    post("/api/{env}/worktree/{n}/take"), post("/api/{env}/board/{n}/build"), post("/api/{env}/settings"),
)

RUNS = (
    post("/api/{env}/agent/{session}/keys"), post("/api/{env}/agent/{session}/shell"),
    *writes("tool"), *writes("check"), post("/api/{env}/sequence/{n}/run"),
    *writes("plugin"), post("/api/{env}/plugins/preview"), post("/api/{env}/plugins/{n}/upgrade-preview"),
    post("/api/{env}/share/install_tunler"), post("/api/{env}/share/update_tunler"),
    post("/api/services/{id}"), post("/api/stop"), post("/api/update"), post("/api/upgrade"),
)

NEVER = (*writes("phone"), get("/api/{env}/phone"), get("/api/{env}/phone/{n}"))

LISTS = ((ALLOWED, True), (TO_WEIGH, True), (RUNS, RUNS_ALLOWED), (NEVER, False))


def allowed(route: Route, params: dict) -> bool:
    """The narrowest entry that names the page decides, a refusal winning a tie; a page no entry names is refused."""
    naming = [(endpoint.narrowness, not verdict) for listed, verdict in LISTS for endpoint in listed if endpoint.covers(route, params)]
    return bool(naming) and not max(naming)[1]


def reached(root: Path, route: Route, params: dict, query: dict, body: dict, environment: str) -> bool:
    """Whether a phone in this environment may reach the page: the path and query name its own environment, and a target the body names is one of this journal's."""
    here = {Named.from_json(given).env for given in (params, query)} - {""}
    target = Named.from_json(body).env
    return allowed(route, params) and here <= {environment} and (not target or known_environment(root, target))
