# Admission

`ShellAdmission` (implemented by `LineAdmission`) decides, before anything starts, whether a line may run. It either
admits the line, with an execution plan of its parts, or refuses it with one `RefusalCode`, the reason and the
correction. A refused line starts nothing.

## The order of the checks

1. The line is read into a syntax tree. A line that does not parse is `syntax-invalid`, one with an unsupported
   construct or an expansion whose value is only known at run time is `syntax-unsupported`, one past the limits is
   `analysis-limit`.
2. The parts are classified against the active rules. When the rules cannot be read the line fails with
   `classification-unavailable`; rules that clash fail it with `rule-conflict`.
3. Every part must be known. An unknown program is `command-unknown`, an option its rule does not accept is
   `option-unknown`, a script or alias that cannot be followed is `unresolved-executable`, and a part whose rule is
   still in review is `pending-review`. An unknown command or option is held as a command request
   (`unknown_command`), see [workflow.md](workflow.md).
4. The output a Full-output part prints must reach the runner: a pipe or redirect that would hide it is
   `output-hidden`. Run it unpiped and read its stored output.
5. The actor's permissions: a denied class is `class-denied`, a denied command pattern is `command-denied`.
6. Phase timing: a test or check asked for in the middle of a plan phase is `phase-timing`. Tests and checks run at
   the end of the phase.
7. Every Full-output part needs an approved, proven reader. Without one the line is `reader-required` and held as a
   command request (`reader_required`).
8. The runner: a full output disk or a host whose runner is off is `runner-unavailable`.

A request key replayed after the rule revision it was admitted under has changed is `rule-revision-changed`.

## Corrections

Every refusal carries the line to try instead: run without the pipe, run at the phase end, propose a rule, use a host
with its runner on. Admission never rewrites a line itself.

## Role defaults and session policy

What an actor may run comes from `CommandPermissionResolver`, read from the actor's profile, never from a check on
what kind of actor it is. The session policy of plan 10 plugs in at that resolver.
