from features.base import Behaviour, FeatureDetails, Line
from features.groups import Group
from features.helpers.handlers import helper_waits_on_question, report_waits, still_unreported
from features.settings import Setting
from features.trigger import MINUTES, Trigger


class HelpersDetails(FeatureDetails):
    explains = "The agent can start a helper for a bounded job. You can see the helper's progress and report."
    name = "helpers"
    group = Group.SESSIONS
    label = "Allow helper agents"
    skill_of = "todos"
    when = "a bounded job goes to a helper on another provider, such as Codex, or a helper reports"

    title = "Helpers"

    abstract = """
        A helper agent on any provider takes one bounded job in an environment of its own, kept out
        of the lists, and its report comes back to the chat
    """

    help = """
        A helper is for work that writes. Work that only reads, such as a review, research or a
        design, goes to your own subagent instead, also when it reviews a branch in a nested
        checkout, dispatched with your agent tool: Claude's Agent tool, Codex's spawn_agent with an
        agent_type from .codex/agents. The subagent shows in the viewer's agent list and its answer
        comes back to you.

        A helper or subagent that has worked in the project already knows it. New work that is
        related to its job, or touches the same code, goes to it with a message, journal helper say
        <n> "<the new work>" for a helper and SendMessage (send_input on Codex) for a subagent,
        instead of a fresh dispatch; keep one around while related work may follow. When you
        dispatch a new helper while an idle one already touched the files its job names, the answer
        names that one.

        At most helpers.kept (8) agents of each type, such as helpers or designers, are kept for reuse, and at
        most helpers.working (6) agents work at the same time; 0 turns a limit off. When the kept ones of
        a type are full and some of them wait for work, a new dispatch of that type is refused with the
        idle ones listed, those that touched the same files first, each with the line that sends it the
        work. An idle agent of another type never has to go. journal helper finish <n> or journal agent
        retire <id> frees a place. Reviewers and critics start fresh, so they are never held back.

        journal helper dispatch <name> "<job>" --provider codex --model <model> --brief "<the bounded
        job>" starts a helper in an environment of its own, named after you and the helper, which
        stays out of the environment lists; --worktree gives it a worktree cut from the working
        branch for any job that changes code, and --checkout <path> launches it instead in a git
        checkout inside the project, such as a nested repository on its own branch. The name follows the naming law and the model is
        always named, one the provider offers: a model it does not offer is refused with the list
        of those it does. You are told when it reports: its report shows in the chat as a message from
        it. journal helper say <n> "<text>" [--todos <n>,<n>] sends it a follow-up and hands it those to-dos; journal helper stop <n> ends its
        agent; once its work is taken (journal worktree take) or dropped, journal helper finish <n>
        packs its environment away. Helpers write to one another the same way: from a helper,
        journal helper say <n> "<text>" reaches the helper of that number at once, or at its next
        turn while it is busy, on Codex and Claude alike, and journal helper peers lists them.

        --todos <n>,<n> hands the helper rows of your own list: they are its alone, so nobody else
        starts or closes them. The helper marks one with journal helper done <n> "<what
        landed>": it shows as done, waiting for its merge, and closes once its worktree is taken.
        Stopping the helper, or its turn ending in an error, gives back the rows it has not
        finished; finishing it gives back the rest.

        A question a helper asks in its own environment, or a subagent asks in the environment lent
        to it, reaches you at once as a line naming it, the question and its options, and again
        while the question stays open. Answer it with journal question answer <n> in that
        environment; the helpers list and the plan page show a helper that waits on one.

        A helper whose agent stops running before it reports, as after a restart of the machine, is
        named to you at once; one that has done nothing for a while is named so you can check on it.
    """

    behaviours = [
        Behaviour(
            name="watch",
            title="Tell the agent when a helper stops or goes quiet before it reports",
            trigger=Trigger(every=1, unit=MINUTES),
        ),
    ]

    settings = [
        Setting(
            name="kept",
            default=8,
            title="Agents kept for reuse of each type",
            abstract="Helpers, designers and each other type count apart. 0 turns the limit off",
            unit="agents",
        ),
        Setting(
            name="working",
            default=6,
            title="Agents working at the same time",
            abstract="0 turns the limit off",
            unit="agents",
        ),
        Setting(
            name="quiet_after",
            default=20,
            title="A helper counts as quiet after",
            unit="minutes",
            under="watch",
        ),
        Setting(
            name="idle_after",
            default=2,
            title="Minutes a helper stands idle before you are told",
            unit="minutes",
            under="watch",
        ),
        Setting(
            name="idle_every",
            default=10,
            title="Minutes between repeats of that notice",
            abstract="0 tells you once",
            unit="minutes",
            under="watch",
        ),
        Setting(
            name="idle_repeats",
            default=0,
            title="Repeats of that notice at most",
            abstract="0 repeats without limit",
            unit="repeats",
            under="watch",
        ),
    ]

    lines = [
        Line(
            name="helper asking",
            title="{{who}}, asks question {{question}} and waits for the answer",
            brief="""
                {{text}} {{options}} It waits in the helper's own environment, so answer it there with {{command}}
            """,
            until=("helper.completed", "helper.deleted"),
            owed=helper_waits_on_question,
            while_waiting=True,
        ),
        Line(
            name="subagent asking",
            title="{{who}}, asks question {{question}} and waits for the answer",
            brief="""
                {{text}} {{options}} Answer it with {{command}}, or leave it to the user
            """,
            until=("question.completed", "question.deleted"),
            while_waiting=True,
        ),
        Line(
            name="reported",
            title="helper {{n}}, {{name}}, reported in message {{message}}",
            brief="read it, then take it with the sequence journal sequence run <Taking a helper's report> --about helper:{{n}}; journal helper finish {{n}} once its work is taken or dropped{{branch}}",
            until=("helper.completed", "helper.deleted"),
            owed=report_waits,
            while_waiting=True,
        ),
        Line(
            name="stopped",
            title="helper {{n}}, {{name}}, stopped running before it reported",
            brief="""
                its agent is gone, so journal helper say cannot reach it. {{cause}} Dispatch the job again, or
                journal helper finish {{n}} and do the job yourself
            """,
            until=("helper.completed", "helper.deleted"),
            owed=still_unreported,
            while_waiting=True,
        ),
        Line(
            name="refused",
            title="helper {{n}}, {{name}}, cannot work because {{provider}} refused it",
            brief="""
                {{provider}} said: {{reason}}. journal helper say cannot help while it refuses. Stop it with
                journal helper stop {{n}}, then dispatch the job again on another provider, or journal helper finish {{n}}
                and do the job yourself
            """,
            until=("helper.completed", "helper.deleted"),
            owed=still_unreported,
            while_waiting=True,
        ),
        Line(
            name="idle",
            title="helper {{n}}, {{name}}, has stood idle for {{minutes}} minutes",
            brief="""
                it finished its turn and waits for work: journal helper say {{n}} "<the next work>", or
                journal helper finish {{n}} once its work is taken
            """,
            while_waiting=True,
        ),
        Line(
            name="quiet",
            title="helper {{n}}, {{name}}, has done nothing for {{minutes}} minutes",
            brief="""
                check on it: journal helper say {{n}} "<what you want to know>", or journal helper stop
                {{n}} if it is stuck
            """,
            while_waiting=True,
        ),
    ]
