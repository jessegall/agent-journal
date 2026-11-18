<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts two present agent sessions and keeps the observation times it was asked at.
 */
final class FakeAgentCounter implements ActiveActorCounter
{
    /**
     * @var list<CarbonImmutable>
     */
    public array $observedAt = [];

    public static function type(): ActorType
    {
        return ActorType::Agent;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        $this->observedAt[] = $observedAt;

        return 2;
    }
}
