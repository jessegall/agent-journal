# Actors, never agents or users directly

An agent and a user are both actors. Wherever code means who did, holds, owns or is asked something, name the actor: an `ActorIdentity`, or `actor_type` and `actor_id` columns. Never store or pass an `agent_id`, `session_id` or `user_id` for that (rule 37).

- A row owned by one actor uses Core's `BelongsToOneActor`.
- Who holds a record is a Core assignment to an actor.
- Where an agent works on something is a frame on its stack, never a stored agent or session.
- Agent and session ids appear only in Core's Agents and Hooks code, where the agent itself is the subject: its sessions, stacks, hook calls and drivers.
- `DomainActorColumnsTest` fails on a domain table with an agent or session column, and on a domain model method that takes or returns a `StackTarget` or `AgentContext`.
