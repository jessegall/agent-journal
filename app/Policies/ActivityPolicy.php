<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Agents\ActivityEntry;

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
