<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ActorAttention;
use App\Contracts\ActorGuidance;
use App\Models\PendingAgentMessage;

/**
 * Keeps guidance as a message for the actor's next hook and asks for its attention, so a sleeping actor wakes to it.
 */
final readonly class HookGuidance implements ActorGuidance
{
    public function __construct(private ActorAttention $attention) {}

    public function retain(ActorIdentity $actor, string $guidance, string $key): void
    {
        $origin = AttentionOrigin::guidance($key);
        PendingAgentMessage::create($actor, $origin, [$guidance], requestsAttention: true);
        $this->attention->request($actor, $origin);
    }
}
