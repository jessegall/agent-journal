<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\ActorGuidance as ActorGuidanceContract;
use App\Contracts\Actors\AgentTexts;
use App\Models\Agents\PendingAgentMessage;
use App\Values\AgentText;

/**
 * Keeps guidance as a message for the actor's next hook and asks for its attention, so a sleeping actor wakes to it.
 */
final readonly class ActorGuidance implements ActorGuidanceContract
{
    public function __construct(private ActorAttention $attention, private AgentTexts $texts) {}

    public function retain(ActorReference $actor, AgentText $guidance, string $key): void
    {
        $origin = AttentionOrigin::guidance($key);
        $text = $this->texts->render($guidance);
        PendingAgentMessage::createMany($actor, $origin, [$text]);
        $this->attention->request($actor, $origin);
    }
}
