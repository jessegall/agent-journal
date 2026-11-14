from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.execution_source import ExecutionSource
from engine.enums.process_type import ProcessType
from engine.enums.starter_type import StarterType
from engine.execution.classes.builtin_class import BuiltinClass
from engine.execution.classes.execution_class import ExecutionClass

# the only place the built-in classes of doc 1266 are written; the first row that holds a subject gives its class
INSTANT, SHORT, LONG = ExecutionLane.INSTANT, ExecutionLane.SHORT, ExecutionLane.LONG
BACKGROUND, NORMAL, AGENT, RESERVED, IMMEDIATE = (ExecutionPriority.BACKGROUND, ExecutionPriority.NORMAL, ExecutionPriority.AGENT,
                                                   ExecutionPriority.RESERVED, ExecutionPriority.IMMEDIATE)
FIRST_HAND = frozenset({StarterType.MAIN_AGENT, StarterType.PERSON})
HELPERS = frozenset({StarterType.HELPER})
SHORT_CATEGORIES = frozenset({CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.EDIT, CommandCategory.VERSION_CONTROL,
                              CommandCategory.NETWORK, CommandCategory.PROCESS, CommandCategory.UNKNOWN, CommandCategory.JOURNAL})
RUN_CATEGORIES = frozenset({CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK})

BUILTIN_CLASSES: tuple[BuiltinClass, ...] = (
    BuiltinClass(ExecutionClass("main agent hook", INSTANT, 1, IMMEDIATE), ExecutionSource.HOOK, FIRST_HAND),
    BuiltinClass(ExecutionClass("agent hook", INSTANT, 1, RESERVED), ExecutionSource.HOOK, HELPERS),
    BuiltinClass(ExecutionClass("main agent command", INSTANT, 1, IMMEDIATE), ExecutionSource.COMMAND, FIRST_HAND),
    BuiltinClass(ExecutionClass("agent command", INSTANT, 1, RESERVED), ExecutionSource.COMMAND, HELPERS),
    BuiltinClass(ExecutionClass("journal hook", INSTANT, 1, NORMAL), ExecutionSource.HOOK),
    BuiltinClass(ExecutionClass("journal command", INSTANT, 1, NORMAL), ExecutionSource.COMMAND),
    BuiltinClass(ExecutionClass("first window request", INSTANT, 1, IMMEDIATE), ExecutionSource.VIEWER_REQUEST, is_first_window=True),
    BuiltinClass(ExecutionClass("window request", INSTANT, 1, NORMAL), ExecutionSource.VIEWER_REQUEST, is_first_window=False),
    BuiltinClass(ExecutionClass("unqueued read", INSTANT, 1, IMMEDIATE), ExecutionSource.UNQUEUED_READ),
    BuiltinClass(ExecutionClass("release work", INSTANT, 1, IMMEDIATE), ExecutionSource.RELEASE_WORK),
    BuiltinClass(ExecutionClass("tick handler", INSTANT, 1, BACKGROUND), ExecutionSource.TICK_HANDLER),
    BuiltinClass(ExecutionClass("listener event", INSTANT, 1, BACKGROUND), ExecutionSource.LISTENER_EVENT),
    BuiltinClass(ExecutionClass("merge", LONG, 1, AGENT, class_limit=1), ExecutionSource.SHELL_LINE, process_types=frozenset({ProcessType.MERGE})),
    BuiltinClass(ExecutionClass("main agent short line", SHORT, 1, IMMEDIATE), ExecutionSource.SHELL_LINE, FIRST_HAND, SHORT_CATEGORIES),
    BuiltinClass(ExecutionClass("agent short line", SHORT, 1, AGENT), ExecutionSource.SHELL_LINE, HELPERS, SHORT_CATEGORIES),
    BuiltinClass(ExecutionClass("journal short line", SHORT, 1, NORMAL), ExecutionSource.SHELL_LINE, categories=SHORT_CATEGORIES),
    BuiltinClass(ExecutionClass("test, build or check", LONG, 4, AGENT), ExecutionSource.SHELL_LINE, categories=RUN_CATEGORIES),
    BuiltinClass(ExecutionClass("package or install", LONG, 2, AGENT), ExecutionSource.SHELL_LINE, categories=frozenset({CommandCategory.PACKAGE})),
    BuiltinClass(ExecutionClass("background job", LONG, 0, AGENT), ExecutionSource.SHELL_LINE, categories=frozenset({CommandCategory.BACKGROUND_JOB})),
    BuiltinClass(ExecutionClass("journal short git", SHORT, 1, NORMAL), ExecutionSource.JOURNAL_RUN),
    BuiltinClass(ExecutionClass("plugin program", LONG, 4, NORMAL), ExecutionSource.PLUGIN_PROGRAM),
    BuiltinClass(ExecutionClass("graphify", LONG, 8, BACKGROUND, class_limit=1), ExecutionSource.GRAPHIFY),
    BuiltinClass(ExecutionClass("journal follow-up", LONG, 1, BACKGROUND), ExecutionSource.FOLLOW_UP),
    BuiltinClass(ExecutionClass("other shell line", SHORT, 1, NORMAL), ExecutionSource.SHELL_LINE),
)
