<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Models\Agents\Agent;
use App\Contracts\Actors\ActiveActorCounter;
use Carbon\CarbonImmutable;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A counter of present agents whose read fails.
 */
final class FailingAgentCounter implements ActiveActorCounter
{
    public static function type(): string
    {
        return Agent::storedType();
    }

    public function count(CarbonImmutable $observedAt): int
    {
        throw SimulatedFailure::of('The session table is gone.');
    }
}
