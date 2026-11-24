<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Enums\ActorType;
use Carbon\CarbonImmutable;

/**
 * Counts the present actors of one type at a database observation time; its owner registers it with Actors.
 */
interface ActiveActorCounter
{
    /**
     * The type of actor this counter counts.
     */
    public static function type(): ActorType;

    /**
     * How many actors of this counter's type were active at the moment observed.
     */
    public function count(CarbonImmutable $observedAt): int;
}
