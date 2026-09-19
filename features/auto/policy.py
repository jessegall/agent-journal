QUESTION_TOOLS = frozenset({"AskUserQuestion", "request_user_input"})
QUESTION_REFUSAL = "Auto mode is on. Decide and continue without a blocking question. If only the user can supply the answer, ask with journal question ask or journal todo ask, end any waiting work, and continue with the next ready row."
APPROVAL_ARGS = {"claude": ("--permission-mode", "auto"), "codex": ("--approve-for-me",)}
APPROVAL_FLAGS = {"claude": frozenset({"--permission-mode", "--dangerously-skip-permissions"}),
                  "codex": frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})}


def refusal(hook) -> str:
    return QUESTION_REFUSAL if hook.tool.name in QUESTION_TOOLS else ""


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    from features.auto.feature import Auto
    flags = {arg.split("=", 1)[0] for arg in args}
    automatic = APPROVAL_ARGS.get(provider, ())
    return [*automatic, *args] if Auto.on_for(record) and flags.isdisjoint(APPROVAL_FLAGS.get(provider, ())) else args
