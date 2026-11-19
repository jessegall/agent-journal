# Communication: desks, inboxes and messages

Messaging lives in Core (`app/Communication`, `app/Desks`). Chat (`domain/Chat`) is the optional product on top of it;
with Chat switched off every command and read below still works.

## Desks and seats

A desk (`App\Desks\Models\DeskRecord`) is a place work and messages are sent to: it owns one inbox and a number of
seats (`DeskSeat`). Sitting at a desk is a Core assignment on the seat (`SeatingWriter::seat`, `replace`, `release`),
so who sits where is read like any other holding. A desk is never an actor.

- Built-in desks come from `InstallDesks`: `main` (one seat, forwards its occupant) and the journal's source-only desks.
- Every agent gets a personal desk when it is created (`CreateAgentHandler` through `ActorProvisioning`); the owner gets
  one when seeded, and a person who registers gets one in the same transaction (`CreateNewUser`).
- A main start takes main's seat (`MainSeatTakeover`, implemented by `Desks\Support\MainTakeover`). A different agent
  holding it is replaced and fenced: `Agent::fenceRuntimes` ends its current runtime, so its credentials are refused.
- Work held by a desk counts as held by everyone seated there (`SharedHolders`), and losing a seat ends the claims it
  carried.

## Inboxes and providers

An inbox (`App\Communication\Contracts\Inbox`, row `InboxRecord`) belongs to a provider registered on
`InboxRegistration` with an `InboxAccess`: shared and exclusive guards, the membership of one actor, all members, and
the inboxes an actor sits at. Desks are one provider (`DeskInboxAccess`); the registry (`RegisteredInboxes`) combines
every provider, so visibility and pending work never assume desks. `InboxDestinationResolver` turns an assignee into
the inbox to write to: its forwarding desk (main for the agent at main), else its own.

## Messages

A message (`App\Communication\Models\Message`) goes from a source inbox the sender sits at to a destination inbox.
Anyone sees it only through an inbox they sit at, or because they wrote it (`MessageVisibility`).

| Command | What it does |
|---|---|
| `SendMessage` | a note nobody has to answer |
| `AskMessage` | a question that waits for an answer; an inbox nobody sits at is refused |
| `ReadMessages` | marks shown messages read for everyone at the inbox; the first reader of a question takes it up |
| `TakeNextMessages` | takes up the oldest questions nobody took up, skipping locked rows |
| `ReplyToMessage` | replies at the observed `state_version`; answers a question and releases its claim |
| `RequireMessageAnswer` | the author turns a note into a question |
| `DismissMessage` | withdraw (author), decline (member) or cancel (owner, as inspection) with a reason |
| `ReleaseMessageClaim` | the owner releases the exact claim an actor holds |

Every write runs under a request key the caller keeps (`RetainedActorRequestKey`), so a retry answers from its receipt.
A claim is a Core assignment proved by the exact seat it was taken through (`ClaimAuthorization`, `ProvedClaims`).

Reads go through `ConversationResolver`: `detail`, `between` and `history` in keyset pages of `MessagePage`, `counts`,
`ownInboxes`, `inspect` for an admitted inspector, and `wakeStatus` for the author. `MessageView` is generated Data;
its first reader and claim holder are absent until there is one.

Facts (`MessageSent`, `MessageRead`, `MessageTakenUp`, `MessageAnswered`, `MessageAnswerRequired`, `MessageDismissed`,
`MessageClaimReleased`) carry ids and actors, never a body, dispatch after commit and are `LogsListenerFailures`: a
failing listener is logged and cannot undo the message.

## Attention and the hooks

A send asks every member of the destination to attend (`InboxAttention`, one `MessageAttention` row each). A member
whose current session runs under a driver is woken inside the send's transaction (`AgentWakes`); one without a runtime
is recorded as such. The hooks report pending inbox work (`PendingInboxWork`), and before the stack is restored they
accept incoming work: `MessageAnswerActivation` gives an agent one answering frame for its oldest standing claim, named
by that claim (`AnsweringMessageStateReference::forClaim`), which finishes when the question is answered or the claim
ends.

## Entries

HTTP: `app/Communication/Routes/communication.php` (`/communication` for people, `/agent/communication` for signed
agents). CLI: `message:send`, `ask`, `reply`, `require-answer`, `read`, `take-next`, `dismiss`, `show`, `history`,
`counts`. MCP: `messages_send`, `messages_ask`, `messages_reply`, `messages_read`, `messages_take_next`,
`messages_dismiss`, `messages_show`, `inbox_history`, `inbox_counts`.

## Chat

Chat shows the conversation between the person's inbox and the chosen agent's inbox, reads only what it showed, and
replies at the shown version. It adds an Inbox page (counts, take next) and a History page (labelled inspection,
cancel with a reason). Pins (`MessagePin`) and docked records (`DockedRecord`) are Chat's own, one per owner, inbox pair
and target, and are left out of lists while unreadable. Owner domains only suggest records for the dock.
