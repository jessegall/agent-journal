from features.base import Behaviour, FeatureDetails, Line, Setting
from features.trigger import MINUTES, Trigger
from features.groups import Group


class TicketsDetails(FeatureDetails):
    name = "tickets"
    group = Group.TICKETS
    trigger_label = "Check the tickets"
    when = "work is put on a board, arrives from an outside source, or a ticket is started"

    title = "Tickets"

    abstract = "A piece of work on a board, from the user, an agent or an outside source, run in an environment of its own"

    help = """
        journal ticket create "<the work>" --brief "<what is wanted>" --set board=<n> --set stage="<stage>" makes one, for
        the whole project. --set source="<source>" --set source_id="<its id>" marks where it came from: the same source and
        id again update that ticket rather than make another. owner names who answers for it; work_environment and plan are set
        when the ticket is started in an environment of its own.

        A started ticket closes only once its branch is merged into the project's branch: once a minute the journal closes
        every ticket whose branch is merged, in its board's done stage, and stops its agent with /exit. Its worktree stays.
        journal ticket complete <n> --yes closes one anyway.

        A message about a board comes from its New work panel and starts the sequence Exploring a request:
        follow it. After every answer you rate how well you understand what they want, 1 to 5, with journal board score;
        at 5 the sequence Drafting the board's cards starts by itself. Never draft before that, and never answer in
        the chat. A draft cannot start; only the user confirms it.

        journal ticket depend <n> <other> says ticket n waits on ticket other. From the agent it is only a proposal: the user
        never sees it while picking cards in New work, and adding cards keeps the waits between the cards added and drops a wait
        on a card left out (journal ticket accept_dependencies <n> / decline_dependencies <n> decide it by hand); from the user
        it holds at once, and a declined proposal holds nothing. While auto mode is on, the agent orchestrating a board may accept or
        decline its tickets' proposed waits and confirm its drafts too, with --why "<reason>"; the ticket keeps a comment saying so. A ticket waiting on an open
        one queues instead of starting, and the minute sweep starts it once the other closes. A dependency that would make a
        cycle is refused.

        At most tickets.running tickets have an agent running at once; a ticket started beyond that waits queued, and the
        minute sweep starts it when one finishes. Set to 0, there is no limit: every started ticket gets its agent at once.

        A rule, doc or tool written from a ticket's environment is held as a proposal for that ticket: it is closed and
        binds nothing until the ticket's branch is merged, when it is reopened; if the ticket closes unmerged it is deleted.
    """

    trigger = Trigger(every=1, unit=MINUTES)

    lines = [
        Line(
            name="ticket_restarted",
            title="ticket {{ticket}}, {{title}}, had lost its agent and was started again",
            brief="it carries on in its conversation; if it stops again you are told instead",
        ),
        Line(
            name="check_board",
            title="check on the ticket agents of {{about}}",
            brief="you have been idle five minutes while orchestrating it: journal ticket board shows which ticket runs; see whether its agent works, waits or is stuck (journal ticket agent_session <n> and its screen), unstick what is stuck, approve plans that wait and merge what is done",
        ),
        Line(
            name="ticket_asks",
            reply_kept=True,
            while_waiting=True,
            title="ticket {{ticket}}, {{title}}, asks question {{question}} - {{text}}",
            brief="answer it when it is yours to decide with journal --env {{env}} question answer {{question}} --how \"<choice>\" "
                  "--set reason=\"<why>\"; its agent is told the answer at once. Otherwise ask the user",
        ),
        Line(
            name="ticket_awaits",
            reply_kept=True,
            while_waiting=True,
            title="ticket {{ticket}}, {{title}}, is waiting - {{text}}",
            brief="if it waits on you, give it what it needs with journal ticket tell {{ticket}} \"<what>\"; if it waits on the user, ask them",
        ),
        Line(
            name="ticket_replied",
            while_waiting=True,
            title="ticket {{ticket}}, {{title}}, answered - {{text}}",
            brief="read the rest in its chat (journal ticket screen {{ticket}}) and carry on",
        ),
        Line(
            name="orchestrator_accepts_waits",
            reply_kept=True,
            while_waiting=True,
            title="ticket {{ticket}}, {{title}}, proposes waits on other tickets for you to decide",
            brief="read them with journal ticket show {{ticket}}; keep the ones that hold with journal ticket accept_dependencies {{ticket}} "
                  "[--only <n,n>] --why \"<reason>\", or journal ticket decline_dependencies {{ticket}} --why \"<reason>\"",
        ),
        Line(
            name="orchestrator_confirms_drafts",
            reply_kept=True,
            while_waiting=True,
            title="ticket {{ticket}}, {{title}}, is a draft waiting for you to confirm it",
            brief="when it is work the board should do, confirm it with journal ticket confirm {{ticket}} --why \"<reason>\"; otherwise "
                  "leave it for the user",
        ),
    ]

    behaviours = [
        Behaviour(name="asks", title="Remind the orchestrator of a ticket's open question", trigger=Trigger(every=5, unit=MINUTES)),
        Behaviour(name="awaits", title="Remind the orchestrator of a ticket waiting on a person", trigger=Trigger(every=5, unit=MINUTES)),
        Behaviour(name="decisions", title="Remind the orchestrator of decisions it can make itself", trigger=Trigger(every=5, unit=MINUTES)),
        Behaviour(name="board check", title="Ask an idle orchestrator to check its boards", trigger=Trigger(every=5, unit=MINUTES)),
    ]

    settings = [
        Setting(
            name="remind_every",
            default=5,
            title="Remind the orchestrator that a ticket's plan is done, every",
            unit="minutes",
        ),
        Setting(
            name="running",
            default=3,
            title="Tickets running at once",
            abstract="0 means no limit",
            unit="tickets",
        ),
    ]
