# Models raise their own events

A model method changes only its own row, and the fact of that change is raised by the same method (plan 40).

- A transition saves its own row, checks the save (`assertSaved`), then raises its fact (`raise`), through the
  `App\Concerns\RaisesEvents` trait on a model that implements `App\Contracts\Events\EventSource`. A refused or
  repeated transition raises nothing.
- A model never writes another row: not another model's row, not another row of its own class, not a bulk
  `update` or `delete`. Work across rows lives in a support class or the handler, which calls each row's own method.
  A row that two requests may make at once is made with `insertIfAbsent` from `App\Concerns\InsertsAbsentRows`.
- Handlers and supports never dispatch a business event. A fact with no row to raise on, such as a command-level fact
  carrying the command's operation or reason, is staged with `App\Contracts\Bus\CommandFacts::publishAfterCommit`.
- A listener whose writes must commit or roll back with the command is marked
  `#[App\Attributes\InCommandTransaction]`; it runs inside the transaction. Every other listener hears the
  fact after the real commit. A domain's in-transaction listener on another domain's fact is admitted only when the
  event, or the group it listens through, carries the owner's `#[TransactionListenerConsent]`.
- Requests (an event a listener answers at once, such as `StateTypesRequested`) stay synchronous; projections (such as
  `AccountsChanged` and `PlanProgressChanged`) are public listeners that derive their event from committed facts.

`ModelOwnRowTest`, `EventProducerTest` and `ModelRaiseCallerTest` check this. Their lists in
`tests/Architecture/EventOwners` and `tests/Architecture/RaisingTransitions` name each event's owner and each transition that raises.
