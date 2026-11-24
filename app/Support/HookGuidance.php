<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Actors\AgentTexts;
use App\Models\Agents\PendingAgentMessage;
use App\Values\AgentText;

/**
 * Keeps guidance as a message for the actor's next hook and asks for its attention, so a sleeping actor wakes to it.
 */
final readonly class HookGuidance implements ActorGuidance
{
    public function __construct(private ActorAttention $attention, private AgentTexts $texts) {}

    public function retain(ActorIdentity $actor, AgentText $guidance, string $key): void
    {
        $origin = AttentionOrigin::guidance($key);
        PendingAgentMessage::create($actor, $origin, [$this->texts->render($guidance)], requestsAttention: true);
        $this->attention->request($actor, $origin);
    }
}
