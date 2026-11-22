<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\DeskRecord;
use App\Models\DeskSeat;
use PhpOption\Option;

/**
 * An admitted seating of an actor at a locked desk: the seat it gets, or the seat it already holds there.
 */
final readonly class AdmittedSeat
{
    /**
     * @param  Option<Assignment>  $held
     */
    public function __construct(
        public DeskRecord $desk,
        public DeskSeat $seat,
        public ActorIdentity $actor,
        public Option $held,
    ) {}
}
