<?php

// Prints, as JSON, what the protected-session check needs of the main agent: its id and profile, the inbox of its
// chat with the owner, and its newest session with that session's status and the agent's runtime generation.
$owner = Domain\Access\Models\User::query()->findOrFail(app(Domain\Access\Support\AccessSettings::class)->ownerId);
$agent = App\Models\Agents\MainAgentDesignation::designatedAgent();
$pair = Domain\Chat\Models\DirectChat::findPair(
    null,
    App\Support\ActorIdentity::of($owner),
    new App\Support\ActorIdentity(App\Enums\ActorType::Agent, $agent->id),
);
$session = App\Models\Agents\AgentSession::query()->where('agent_id', $agent->id)->latest('created_at')->first();

echo json_encode([
    'agent' => $agent->id,
    'profile' => $agent->profile_key,
    'inbox' => $pair?->conversation->inbox_id,
    'session' => $session?->id,
    'status' => $session?->status->value,
    'generation' => $agent->runtime_generation,
]), "\n";
