<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Actors\AttentionOrigin;
use App\Actors\AttentionOutcome;
use App\Actors\Contracts\ActorAttention;
use App\Support\ActorReference;

/**
 * Keeps every attention request instead of waking a runtime: who was asked, and the wake key of the origin.
 */
final class RecordedAttention implements ActorAttention
{
    /**
     * @var list<array{ActorReference, string}>
     */
    public array $wakes = [];

    public function request(ActorReference $actor, AttentionOrigin $origin): AttentionOutcome
    {
        $this->wakes[] = [$actor, $origin->keyFor($actor)];

        return AttentionOutcome::noRuntime();
    }
}
