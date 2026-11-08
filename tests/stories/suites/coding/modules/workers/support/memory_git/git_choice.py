from contextvars import ContextVar

REAL_GIT: ContextVar[bool] = ContextVar("real_git", default=False)
