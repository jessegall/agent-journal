from features.base import Behaviour, FeatureDetails, Line
from features.trigger import MINUTES, Trigger
from features.groups import Group


class PlansDetails(FeatureDetails):
    explains = 'The agent can make a plan in phases and move it along as its to-dos close. You can review it and approve checkpoints.'
    name = "plans"
    group = Group.PLANS
    when = "the user asks for a plan, phases or a roadmap, or a plan is started, advanced or finished"

    title = "Plans"


    abstract = "A plan moves on as its to-dos close: a phase completes, a checkpoint waits for you, and the last phase ends the plan."

    help = """
        A plan is built in order. journal plan create "<name>" --set goal="<what is true when
        done>" --set depth=normal|thorough starts it building, at its phases stage. When the user
        asks for a plan in the chat, settle how thorough it must be first: take it from what they
        said, judge it yourself when the work makes it plain, and ask with a question when you
        cannot tell. A thorough plan is researched and has a to-do for every small thing. Add every phase with journal plan phase
        <n> "<title>" --when "<complete when>" (--checkpoint where the user should look before
        it goes on).

        Then journal plan stage <n> todos, file the rows and put each under its phase with
        journal plan todos <n> <phase> <rows...>, or board tickets with journal plan tickets <n>
        <phase> <tickets...>. When every phase has rows, journal plan ready <n> hands it to the user.

        A plan whose phases hold tickets gets a worker agent of its own when it first starts, in its
        own environment and worktree, and the journal starts each phase's tickets once the phase
        before is done. The environment's own agent stays a co-assistant: asked how a plan is going,
        it answers from journal plan progress <n>, which gives the phase it is in, the state of that
        phase's rows and tickets, and what happened last.

        When the user asks for a review of a plan, run journal plan review <n> before you dispatch
        the reviewers: the plan is under review and cannot be approved until their report is
        linked to it with journal report link <report n> plan:<n>, which returns it to building
        for you to revise and mark ready again.

        Only the user approves a plan, and then you start it with journal plan start <n>; only the user continues it past a checkpoint; with the auto
        feature on, checkpoints are passed without waiting.

        You work one plan at a time. Starting a plan parks the one that runs, unless a helper
        or a ticket's agent works a row of its current phase: that plan keeps running beside it.
        journal plan park <n> sets a plan aside; a parked plan's rows wait until it is started
        again.
    """

    behaviours = [
        Behaviour(
            name="still",
            title="Remind the agent to continue a running plan when it stops",
            trigger=Trigger(every=5, unit=MINUTES),
        ),
        Behaviour(
            name="blocked",
            title="Recheck a running plan's blocked to-dos",
            trigger=Trigger(every=30, unit=MINUTES),
        ),
    ]

    lines = [
        Line(
            name="still",
            reply_kept=True,
            title="plan {{n}}, {{title}}, is running and nothing has moved for {{minutes}} minutes",
            brief="""
                carry on with it now: {{rows}}. If a row is stuck or waits on something, leave it and work
                the rows you can do; put a question on a row with journal todo ask only for what you cannot
                decide yourself, and keep going with the rest.
            """,
        ),
        Line(
            name="blocked",
            reply_kept=True,
            title="plan {{n}}, {{title}}, has blocked to-dos: check whether each still is",
            brief="""
                {{rows}}. Look at what each waits on: unblock one that can go on now (journal todo unblock
                <n>) and work it; a choice the user delegated to you, or one an earlier answer already settles,
                is yours to decide now: decide it, say so on its row, and go on; make only a choice nobody has
                settled a question, with journal todo ask <n> "<who decides what>"; keep the reason of the rest up
                to date. Then take the next ready row: a blocked row never ends the turn, and once only blocked
                rows are left in a phase, every later phase's rows whose own waits are done are ready.
            """,
        ),
        Line(
            name="started",
            title="the user started plan {{n}}, {{title}} - build it with them",
            brief="""
                journal plan show {{n}} for what they want, and a template's instructions come
                first; ask what you cannot settle, then add its phases and rows. {{depth}}
            """,
        ),
        Line(
            name="phases",
            title="plan {{n}} is building - add its phases",
            brief="""
                journal plan phase {{n}} "<title>" --when "<complete when>" for each phase,
                --checkpoint where the user should look; then journal plan stage {{n}} todos
            """,
        ),
        Line(
            name="todos",
            title="plan {{n}} is at its to-dos",
            brief="""
                file each phase's rows and put them under it with journal plan todos {{n}}
                <phase> <rows...>; when every phase has rows, journal plan ready {{n}}
            """,
        ),
        Line(
            name="ready",
            title="every phase of plan {{n}} has its to-dos",
            brief="journal plan ready {{n}} hands it to the user, who approves it",
        ),
        Line(
            name="reviewed",
            title="the review of plan {{n}}, {{title}}, is in: report {{report}}",
            brief="revise the plan by the report, then journal plan ready {{n}} hands it back to the user",
        ),
        Line(
            name="approved",
            title="the user approved plan {{n}}, {{title}} - start it",
            brief="journal plan start {{n}} makes it active and parks a plan that runs; then work its first phase's rows in order",
        ),
        Line(
            name="picked up",
            title="the user started plan {{n}}, {{title}} - it is active now",
            brief="work the rows of its current phase, phase {{phase}}, in order; a plan that ran is parked and its rows wait",
        ),
        Line(
            name="parked",
            title="the user parked plan {{n}}, {{title}}",
            brief="its open rows wait until it is started again: leave them and go on with other work",
        ),
        Line(
            name="plan mode",
            title="plan mode is not used in a journal project",
            brief="""
                write the plan as a journal plan instead: journal plan create "<name>" --set
                goal="<what is true when done>", then its phases and rows
            """,
        ),
    ]
