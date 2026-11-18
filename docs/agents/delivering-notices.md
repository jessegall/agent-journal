# Delivering a notice to an agent

A domain or Core module that must tell a running agent about work (a message for it, work assigned to it) delivers a
notice through the agent's driver. The notice is durable: it is written in the same database transaction as the
change it is about, so either both are stored or neither is.

## How

Inside the command handler that changes the subject, dispatch the exported `DeliverAgent` command (or `WakeAgent`
when the agent only has to look at its pending work) with:

- an idempotency key derived from the subject change, so a replayed command delivers nothing twice;
- plain text content and opaque references the receiving agent can read through its own authorized commands,
  never a record's private fields.

The bus runs the handler in one transaction. The subject row and the driver request commit together; a command that
rolls back leaves no request. The host carries the request out only after the commit, in order behind the agent's
earlier requests.

## What not to do

- Never deliver from an after-commit callback or a `ShouldDispatchAfterCommit` event listener when the notice must
  arrive: a crash between the commit and the callback loses it. After-commit events are for screens and other
  best-effort reactions only.
- Never call into `app/Agents` internals: only the exported commands.
- Never put content in the notice that the receiver may not read.

## Today

Messages wake their receiver this way (plan 16, task 829). No other owner notifies an agent yet; the agent finds
assigned work at its next hook through its work stack.
