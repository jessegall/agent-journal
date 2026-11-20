<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Actors\Contracts\Policy;
use Domain\Chat\Models\DockedRecord;

/**
 * Every actor keeps its own docked records; whether it may read the record is checked on each change and each list.
 */
final readonly class DockedRecordPolicy implements Policy
{
    public static function model(): string
    {
        return DockedRecord::class;
    }
}
