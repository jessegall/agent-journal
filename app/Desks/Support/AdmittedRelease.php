<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Support\Assignment;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;

/**
 * An admitted release at a locked desk: the seat and the assignment that is about to end.
 */
final readonly class AdmittedRelease
{
    public function __construct(public DeskRecord $desk, public DeskSeat $seat, public Assignment $before) {}
}
