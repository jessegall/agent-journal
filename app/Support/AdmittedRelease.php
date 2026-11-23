<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;

/**
 * An admitted release at a locked desk: the seat and the assignment that is about to end.
 */
final readonly class AdmittedRelease
{
    public function __construct(public DeskRecord $desk, public DeskSeat $seat, public Assignment $before) {}
}
