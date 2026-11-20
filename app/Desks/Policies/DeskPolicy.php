<?php

declare(strict_types=1);

namespace App\Desks\Policies;

use App\Actors\Contracts\Policy;
use App\Desks\Models\DeskRecord;

/**
 * Desks are arranged by the actors the registration lets arrange them; the policy adds no rule of its own.
 */
final readonly class DeskPolicy implements Policy
{
    public static function model(): string
    {
        return DeskRecord::class;
    }
}
