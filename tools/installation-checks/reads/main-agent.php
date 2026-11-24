<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\DirectChat;

// Prints, as JSON, what the protected-session check needs of the main agent: its id and profile, the inbox of its
// chat with the owner, and its newest session with that session's status and the agent's runtime generation.
$owner = User::query()->findOrFail(app(AccessSettings::class)->ownerId);
$agent = MainAgentDesignation::designatedAgent();
$pair = DirectChat::findPair(
    null,
    ActorIdentity::of($owner),
    new ActorIdentity(ActorType::Agent, $agent->id),
);
$session = AgentSession::query()->where('agent_id', $agent->id)->latest('created_at')->first();

echo json_encode([
    'agent' => $agent->id,
    'profile' => $agent->profile_key,
    'inbox' => $pair?->conversation->inbox_id,
    'session' => $session?->id,
    'status' => $session?->status->value,
    'generation' => $agent->runtime_generation,
]), "\n";
