<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts the present actors of one type at a database observation time; its owner registers it with Actors.
 */
interface ActiveActorCounter
{
    public static function type(): ActorType;

    public function count(CarbonImmutable $observedAt): int;
}
