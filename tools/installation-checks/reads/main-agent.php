<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\DirectChat;

// Prints, as JSON, what the protected-session check needs of the main agent: its id and profile, the inbox of its
// chat with the owner, its newest session, whether that session runs and the process generation it runs.
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
    'isRunning' => $session?->status->isRunning() ?? false,
    'processGeneration' => AgentRuntime::query()->where('agent_session_id', $session?->id)->value('process_generation'),
]), "\n";
