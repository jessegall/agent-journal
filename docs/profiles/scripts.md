# Profile scripts

A profile can carry a script that runs when its agent stops. The owner writes it in the profile's shared draft, and
activation compiles it into the stored program the profile's sessions run.

## The language

```text
ON STOP
IF workspace.dirty
  RUN tests
  YIELD "Commit your work once the tests pass."
END
END
```

- `ON STOP` opens the handler of the stop trigger.
- `IF <object>.<member>` branches on a boolean member. `CHECK` fails when the member does not hold.
- `RUN <command>` runs one of the draft's own commands.
- `YIELD "<guidance>"` hands the stop back to the agent with the guidance.
- `NOTE "<text>"` keeps bounded evidence.

Commands are defined with the draft as JSON: `executable`, `arguments`, `directory`, `effects`, `timeout_seconds`.

`profile:language` lists every keyword and object as the journal has them now. A keyword or object that a domain
registers shows up there, and in the editor, with no other change.

## Writing a draft

- `profile:draft <profile> --source - --commands '<json>' --expected-revision <n>` saves a draft. It is kept even
  when it does not check, and an older expected revision is refused.
- `profile:check <profile> --source -` checks text without saving it.
- `profile:draft-show <profile>` reads the draft with its diagnostics and its flowchart.
- Only the owner activates a draft, with `profile:activate --draft <profile>=<revision>`. An agent can draft but never
  activate.

The CLI, MCP and the editor at `/accounts/scripts/<profile>` give the same diagnostics. A diagnostic names its line,
column and length, counted from 1 in code points.

## How a stop runs the script

- Each stop runs or continues one run of the activated program. A step that waits for the host suspends the run,
  and the agent is woken to stop again when the host answers. A step never runs twice: each run replays the steps it
  recorded.
- Falling through the script admits the stop to the final checks. A pass certifies the work; a pass of the script
  alone never does.
- A YIELD or a failure hands the stop back. Three returns in a row on an unchanged workspace hold the work and tell
  the parent once.
- A definition that changed since activation holds the work before any instruction runs.

## The flowchart

The flowchart is built from the compiled program: the trigger, each instruction, the stop's policy steps (final
checks, the return policy) and the terminals (certified, return to actor, held). Each node has a rank, its longest
path from the trigger, and an order within that rank. Pending and uncertain are not ports, so the graph has no retry
loop. The same graph exports as Mermaid text, with labels escaped so they never read as diagram markup.

`profile:run-show <run>` is the text view of one run: its state, the line it waits on, what it told the agent and
each recorded step.
