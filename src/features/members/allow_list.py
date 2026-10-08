from features.phone.allow_list import Action, Page, actions, get

SHARED = ("message", "comment", "todo", "doc", "question", "reaction", "report", "plan")

UNREAD = ("secret", "phone", "share", "browser", "plugin", "output", "worktree")

READABLE = (*SHARED, "agent", "board", "check", "collection", "critique", "dump", "environment", "fact", "feature", "helper", "notice",
            "notification", "nudge", "profile", "record", "reminder", "rule", "sequence", "suggestion", "template", "ticket", "tool",
            "trigger", "work")

READ_PAGES = frozenset((
    get("/api/identity"), get("/api/manifest"), get("/api/summary"), get("/api/pages"), get("/api/changelog"), get("/api/releases"),
    get("/api/agents"), get("/api/{env}/events"), get("/api/{env}/stream"), get("/api/{env}/dashboard"), get("/api/{env}/search"),
    get("/api/{env}/settings"), get("/api/{env}/family"), get("/api/{env}/bar"), get("/api/{env}/health"),
))

READS = frozenset((
    *READ_PAGES,
    *(action for type_ in READABLE for action in actions(type_, "all show choices markdown")),
    *(Action(type_, "files") for type_ in SHARED),
))

READ_MARKS = frozenset(Action(type_, "read_all") for type_ in READABLE)

WRITES = frozenset((
    *actions("message", "create edit comment"),
    *actions("comment", "create reply done update"),
    *actions("todo", "create update comment done reopen block unblock priority"),
    *actions("doc", "create update section comment"),
    *actions("question", "answer comment"),
    *actions("reaction", "create"),
    *actions("report", "comment"),
    *actions("plan", "comment"),
))


def read(target: Page | Action) -> bool:
    return target in READS or target in READ_MARKS


def written(target: Page | Action) -> bool:
    return target in WRITES
