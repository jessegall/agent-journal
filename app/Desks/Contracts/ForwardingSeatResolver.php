<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Actors\Contracts\Actor;
use App\Desks\Support\OccupiedSeat;
use PhpOption\Option;

/**
 * The seat an actor forwards its work and messages to, when it holds one.
 */
interface ForwardingSeatResolver
{
    /**
     * @return Option<OccupiedSeat>
     */
    public function forActor(Actor $actor): Option;
}
