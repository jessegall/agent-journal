<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use Carbon\CarbonImmutable;
use RuntimeException;

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
        throw new RuntimeException('The session table is gone.');
    }
}
