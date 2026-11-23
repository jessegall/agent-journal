<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\ActivityEntry;

/**
 * Only the owner reads what the journal's agents did.
 */
final readonly class ActivityPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return ActivityEntry::class;
    }
}
