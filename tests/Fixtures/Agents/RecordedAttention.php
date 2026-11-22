<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Contracts\ActorAttention;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;

/**
 * Keeps every attention request instead of waking a runtime: who was asked, and the wake key of the origin.
 */
final class RecordedAttention implements ActorAttention
{
    /**
     * @var list<array{ActorIdentity, string}>
     */
    public array $wakes = [];

    public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome
    {
        $this->wakes[] = [$actor, $origin->keyFor($actor)];

        return AttentionOutcome::noRuntime();
    }
}
