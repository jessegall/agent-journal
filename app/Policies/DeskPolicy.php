<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Contracts\Authorization\Policy;
use App\Models\DeskRecord;

/**
 * Desks are arranged by the actors the registration lets arrange them; the policy adds no rule of its own.
 */
final readonly class DeskPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return DeskRecord::class;
    }
}
