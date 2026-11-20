<?php

declare(strict_types=1);

namespace App\Supervision\Policies;

use App\Actors\Contracts\Policy;
use App\Supervision\Models\SupervisorLink;

/**
 * Who may act on SupervisorLink records; the grant decides, and the handlers keep their own checks.
 */
final readonly class SupervisorPolicy implements Policy
{
    public static function model(): string
    {
        return SupervisorLink::class;
    }
}
