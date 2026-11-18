<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts one present user and keeps the observation times it was asked at.
 */
final class FakeUserCounter implements ActiveActorCounter
{
    /**
     * @var list<CarbonImmutable>
     */
    public array $observedAt = [];

    public static function type(): ActorType
    {
        return ActorType::User;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        $this->observedAt[] = $observedAt;

        return 1;
    }
}
