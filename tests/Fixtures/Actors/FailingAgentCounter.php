<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use Carbon\CarbonImmutable;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A counter of present agents whose read fails.
 */
final class FailingAgentCounter implements ActiveActorCounter
{
    public static function type(): ActorType
    {
        return ActorType::Agent;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        throw SimulatedFailure::of('The session table is gone.');
    }
}
